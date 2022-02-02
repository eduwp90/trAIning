import React, { useEffect } from "react";
import "./App.less";
import WorkoutForm from "./Pages/workoutForm";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/home";
import Main from "./Pages/main";
import Login from "./Pages/login";
import Register from "./Pages/register";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "./Services/authService";

const App: React.FC = () => {
  const [user, loading] = useAuthState(AuthService.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (!user) navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="workout" element={<WorkoutForm />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
