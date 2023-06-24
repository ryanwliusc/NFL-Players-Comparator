import './App.css';
import React, { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom';

const Result = () => {
  const { state } = useLocation();
  const data = state;
  return (
    <div className="App">
      <header className="App-header">
        <h2>Here are the top 5 similar players to your prospect:</h2>
        
      </header>
      <body className='App-body'>
        <p> {data}</p>
        <a href = "http://localhost:3000">Return to start</a>
      </body>
    </div>
  );
}

export default Result;