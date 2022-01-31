import React from 'react';
import './App.css';
import WorkoutForm from './Pages/workoutForm';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/home';
import Main from './Pages/main';
import Login from './Pages/login';
import Register from './Pages/register';
import AuthService from './Services/authService';

const App: React.FC = () => {
  console.log('Authenticated? ', AuthService.isAuthenticated());

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            AuthService.isAuthenticated() ? (
              <Navigate to='/main' />
            ) : (
              <Navigate to='/login' />
            )
          }
        />
        <Route path='/main' element={<Main />}>
          <Route index element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route path='workout' element={<WorkoutForm />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
