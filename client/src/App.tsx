import React from 'react';
import './App.css';
import WorkoutForm from './Pages/workoutForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/home';
import Main from './Pages/main';
import Login from './Pages/login';
import Register from './Pages/register';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />}>
          <Route index element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/workout' element={<WorkoutForm />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
