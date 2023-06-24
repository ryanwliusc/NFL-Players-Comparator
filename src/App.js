import './App.css';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports';
import { getPlayer, listPlayers } from './graphql/queries'
import { createPlayer } from './graphql/mutations'
import Papa from 'papaparse';
import csvFile from './csv/players.csv';
import {useLocation} from 'react-router-dom';

Amplify.configure(awsExports)
API.configure(awsExports);


function App() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState();

  //helper function to check how close a player is to another where we weight the ras difference by .9 and college difference by .1
  function distance(ras, cRas, college, cCollege){
    let sameCollege = 10
    if (college === cCollege){
      sameCollege = 0
    }
    return 0.9 * Math.sqrt(Math.pow(ras - cRas, 2)) + 0.1 * sameCollege
  }
  async function HandleSubmit(e){
    //on submit we get the form values entered and use that to find the best comparisons
    e.preventDefault();
    const form = e.target;
    const name = form.playerName.value;
    const ras = form.ras.value;
    const college = form.college.value;
    const pos = form.position.value;
    if (name == "" || ras < 0 || ras > 10 || college == "" || isNaN(parseFloat(ras))){
      setError("Missing/Invalid parameters, please try again")
    }
    else{
    let nextToken = null
      try {
        const result = await API.graphql(graphqlOperation(listPlayers, {
          filter: { position: { eq: pos } },
          limit: 1000,
          nextToken: nextToken
        }));
        const players = result.data.listPlayers.items;
        let distances = []
        //KNN algorithm using the players of the same position
        for (let i = 0; i < players.length; i++){
          distances.push([distance(players[i].ras, ras, players[i].college, college), players[i].name, players[i].college, players[i].position, players[i].ras])
        }
        distances.sort()
        let transfer = distances.slice(0, 5)
        transfer.push([[name, college, pos, ras]])
        navigate('/result', {state: transfer})

      } catch (error) {
        console.log('Error fetching players:', error);
      }
    }
  }

  //utility function to add players from a csv to the db
  async function addData(){
    fetch(csvFile)
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            const data = results.data;
            // Process the CSV data
            data.forEach((row) => {
              const playerName = row.Name;
              const college = row.College;
              const position = row.Pos;
              const ras = row.RAS;
              if (position != "QB"){
                try {
                  const input = {
                    name: playerName,
                    college: college,
                    position: position,
                    ras: parseFloat(ras),
                  };

                  const createPlayerResponse = API.graphql(
                    graphqlOperation(createPlayer, { input })
                  );
        
                  console.log('Player created:', createPlayerResponse.data.createPlayer);
                } catch (error) {
                  console.error('Error creating player:', error);
                }
            }
            
            });
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
          },
        });
      })
    .catch((error) => {
      console.error('CSV file fetch error:', error);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="Error"><p>{error}</p></div>
        <h2>Player Success Predictor</h2>
        
      </header>
      <body className='App-body'>
      
        <p>Enter the Name, Position, RAS <a target="_blank" and rel="noopener noreferrer" href="https://ras.football/ras-calculator/">(Raw Athletic Score)</a>, and College of a prospect and we will predict their future success in the NFL! </p>
        <form method="post" onSubmit={HandleSubmit} className='form'>
          <label> Name: <input name = "playerName"  /></label>
          <label> College:  <input name = "college"  /> </label>
          <label> Position: 
          <select name="position">
          <option value="QB">QB</option>
          <option value="RB">RB</option>
          <option value="FB">FB</option>
          <option value="WR">WR</option>
          <option value="TE">TE</option>
          <option value="OT">OT</option>
          <option value="OG">OG</option>
          <option value="OC">C</option>
          <option value="DE">DE</option>
          <option value="DT">DT</option>
          <option value="LB">LB</option>
          <option value="CB">CB</option>
          <option value="FS">FS</option>
          <option value="SS">SS</option>
          <option value="PK">PK</option>
          <option value="LS">LS</option>
		      </select>
          </label>
          <label> RAS: <input name = "ras" /></label>
          <button type="submit">Compare Player!</button>
        </form>
        
      </body>
      <footer className="App-footer">
        {(!state) ? (
          <h3>No Previous Prospects Entered </h3>
        ) : (
          <div>
          <h3>Previous prospect: </h3>
          <p> Name: {state[0][0]}</p>
          <p> College: {state[0][1]}</p>
          <p> Position: {state[0][2]}</p>
          <p> Ras: {state[0][3]}</p>
          </div>
        )}
        
        </footer>
    </div>
  );
}

export default App;
