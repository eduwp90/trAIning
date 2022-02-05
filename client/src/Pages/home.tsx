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
  const [publicWorkouts, setPublicWorkouts] = useState<IWorkout[]>([]);

  useEffect(() => {
    let mounted = true;
    const renderUserWorkouts = async () => {
      let userData;
      let publicData;
      if (user && mounted) {
        userData = await getUserWorkouts(user!.uid);
        publicData = await getUserWorkouts("public");
      }
      if (userData && publicData && mounted) {
        setUserWorkouts([...userWorkouts, ...userData]);
        setPublicWorkouts([...publicWorkouts, ...publicData]);
      }
    };
    renderUserWorkouts();
    return () => {
      mounted = false;
    };
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
      <WorkoutList workouts={publicWorkouts}></WorkoutList>
      <Button
        className="new_workout_btn"
        size="large"
        onClick={() => {
          navigate("createworkout");
        }}>
        Create a new workout
      </Button>
      <Button></Button>
    </div>
  );
};

export default Home;
