import React from 'react';
import './App.css';
import WorkoutForm from './Pages/workoutForm';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './Pages/home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/> }/>
        <Route path="/createworkout" element={ <WorkoutForm/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
