import './App.css';
import React, { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const data = state;

  function Back(){
    const name = data[5][0];
    const college = data[5][1];
    const pos = data[5][2];
    const ras = data[5][3];
    const prev = [name, college, pos, ras]
    navigate('/', { state : prev})
  }
  return (
    <div className="App">
      <header className="App-header">
        <h2>Here are the top 5 similar players to your prospect:</h2>
        
      </header>
      <body className="App-body">
      <ol>
        <li>{data[0][1]}, {data[0][2]}, {data[0][3]}, {data[0][4]}</li>
        <li>{data[1][1]}, {data[1][2]}, {data[1][3]}, {data[1][4]}</li>
        <li>{data[2][1]}, {data[2][2]}, {data[2][3]}, {data[2][4]}</li>
        <li>{data[3][1]}, {data[3][2]}, {data[3][3]}, {data[3][4]}</li>
        <li>{data[4][1]}, {data[4][2]}, {data[4][3]}, {data[4][4]}</li>
      </ol>
        <button onClick={Back}>Make some more Comparisons!</button>
      </body>
      <footer className="App-footer">
      <p></p>
      </footer>
    </div>

  );
}

export default Result;