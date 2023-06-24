import './App.css';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports';
import { getPlayer, listPlayers } from './graphql/queries'
import { createPlayer } from './graphql/mutations'
import Papa from 'papaparse';
import csvFile from './csv/qbs.csv';

Amplify.configure(awsExports)
API.configure(awsExports);


function App() {
  const navigate = useNavigate();
  const [previous, setPrevious] = useState([]);

  async function HandleSubmit(e){
    e.preventDefault();
    const form = e.target;
    const name = form.playerName.value;
    const ras = form.ras.value;
    const college = form.college.value;
    const pos = form.position.value;
    let nextToken = null
      try {
        const result = await API.graphql(graphqlOperation(listPlayers, {
          filter: { position: { eq: pos } },
          limit: 1000,
          nextToken: nextToken
        }));
        const players = result.data.listPlayers.items;
        nextToken = result.data.listPlayers.nextToken; 
        console.log(players)
      } catch (error) {
        console.log('Error fetching players:', error);
      }

    setPrevious([name, college, pos, ras])

    
   //navigate('/result', {state: [name, college, position, ras]})
  }
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
              const position = row.Position;
              const ras = row.RAS;

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
        <h2>Player Success Predictor</h2>
        
      </header>
      <body className='App-body'>
      
        <p>Enter the Name, Position, RAS <a target="_blank" and rel="noopener noreferrer" href="https://ras.football/ras-calculator/">(Raw Athletic Score)</a>, and College of a prospect and we will predict their future success in the NFL! </p>
        <form method="post" onSubmit={HandleSubmit} className='form'>
          <label> Name: <input name = "playerName" defaultValue="Tom Brady" /></label>
          <label> College:  <input name = "college" defaultValue="University of Southern California" /> </label>
          <label> Position: 
          <select name="position">
          <option value="QB">QB</option>
          <option value="RB">RB</option>
		      </select>
          </label>
          <label> RAS: <input name = "ras" defaultValue="10.0" /></label>
          <button type="submit">Compare Player!</button>
        </form>
        
      </body>
      <footer className="App-footer">
      <h3>Previous prospect: </h3>
        <p> Name: {previous[0]}</p>
        <p> College: {previous[1]}</p>
        <p> Position: {previous[2]}</p>
        <p> Ras: {previous[3]}</p>
        </footer>
    </div>
  );
}

export default App;
