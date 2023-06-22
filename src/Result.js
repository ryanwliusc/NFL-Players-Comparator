import './App.css';
import React, { useState, useEffect } from 'react'

const Result = () => {
  const [data, setData] = useState([{}])

  useEffect(() =>{
    fetch("/prospect").then(
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
        <h2>Here are the top 5 similar players to your prospect:</h2>
        
      </header>
      <body className='App-body'>
      {(typeof data.members === 'undefined') ? (
          <p>Loading.....</p>
        ) : (
          data.members.map((member, i) => (
            <p key ={i}>{member}</p>
          ))
        )}
      </body>
      <footer className='App-footer'>
      <a href = "http://localhost:3000">Return to start</a>
        
      </footer>
    </div>
  );
}

export default Result;