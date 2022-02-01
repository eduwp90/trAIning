import { Button } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutsContext from "../workoutContext";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const { userWorkouts } = useContext(WorkoutsContext);

  return (
    <div>
      {userWorkouts.map((workout: any) => {
        return <p>{`${workout.workout[0].exer}`}</p>;
      })}
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
