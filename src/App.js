import React from 'react';
import {Routes,Route } from "react-router-dom";
import './App.css'
import PathfindingVS from './pages/PathfindingVs'
import Home from './pages/Home';
import NQueen from './pages/N_Queen';

function App() {

  return (
      <div className="App">
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/path-finding" element={<PathfindingVS/>} />
            <Route exact path="/nqueens" element={<NQueen/>} />
          </Routes>
    </div>
  );
}

export default App;