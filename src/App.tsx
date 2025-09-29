import React from 'react';
import './App.css';
import Home from './Home';
import { Route, Router, Routes } from 'react-router-dom';
import AddTask from './component/AddTask';
import EditTask from './component/EditTask';


function App() {
  
  return (
    <div className="App">
   {/* <Home/> */}
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddTask />} />
        <Route path="/edit/:id" element={<EditTask />} />
      </Routes>
    
    </div>
  );
}

export default App;
