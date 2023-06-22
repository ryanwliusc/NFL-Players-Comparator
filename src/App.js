import './App.css';
import React, { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([{}])

  useEffect(() =>{
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, []
  )
  return (
    <div className="App">
      <header className="App-header">
        <p>Player Success Predictor</p>
        
      </header>
      <h2>Common Predictions:</h2>
        {(typeof data.members === 'undefined') ? (
          <p>1 sec....</p>
        ) : (
          data.members.map((member, i) => (
            <p key ={i}>{member}</p>
          ))
        )}
    </div>
  );
}

export default App;
