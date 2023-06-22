import './App.css';
import React, { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([{}])

  useEffect(() =>{
    fetch("/similar").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, []
  )

  function handleSubmit(e){
    e.preventDefault();
    const form = e.target
    const formData = new FormData(form);
    fetch('http://localhost:5000/prospect', { method: form.method, body: formData })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
  }
  return (
    <div className="App">
      <header className="App-header">
        <h2>Player Success Predictor</h2>
        
      </header>
      <body className='App-body'>
      
        <p>Enter the Name, Position, RAS <a target="_blank" and rel="noopener noreferrer" href="https://ras.football/ras-calculator/">(Raw Athletic Score)</a>, and College of a prospect and we will predict their future success in the NFL! </p>
        <form method="post" onSubmit={handleSubmit} className='form'>
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
      <footer className='App-footer'>
      <h3>Common Predictions:</h3>
        {(typeof data.members === 'undefined') ? (
          <p>Loading.....</p>
        ) : (
          data.members.map((member, i) => (
            <p key ={i}>{member}</p>
          ))
        )}
      </footer>
    </div>
  );
}

export default App;
