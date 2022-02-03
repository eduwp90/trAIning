import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserWorkouts } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { IWorkout } from "../interfaces";
import WorkoutList from "../Components/workoutList";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);
  const [userWorkouts, setUserWorkouts] = useState<IWorkout[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (user) {
        const data: IWorkout[] | undefined = await getUserWorkouts(user!.uid);
        if (data) {
          setUserWorkouts([...userWorkouts, ...data]);
        }
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="pages-Div">
      <div className="list_title">
        <h2>Your workouts</h2>
      </div>
      <WorkoutList workouts={userWorkouts}></WorkoutList>
      <div className="list_title">
        <h2>Here are some recomedantions</h2>
      </div>
      <WorkoutList workouts={userWorkouts}></WorkoutList>
      <Button
        className="new_workout_btn"
        size="large"
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
