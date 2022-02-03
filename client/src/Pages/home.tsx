import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import WorkoutList from "../Components/workoutList";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <WorkoutList />
      <Button
        onClick={() => {
          navigate("/workout");
        }}>
        Create a new workout
      </Button>
      <Button></Button>
    </div>
  );
};

export default Home;
