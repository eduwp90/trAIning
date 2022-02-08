import { Button, Empty, Skeleton, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserWorkouts } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { IWorkout, IWorkoutContext } from "../interfaces";
import WorkoutList from "../Components/workoutList";
import { WorkoutContext } from "../Context/workoutProvider";
import SendChallenge from "../Components/sendChallenge";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);
  const [userWorkouts, setUserWorkouts] = useState<IWorkout[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<IWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { clearWorkout, clearExistingWorkout } = useContext<IWorkoutContext>(WorkoutContext);

  useEffect(() => {
    let mounted = true;
    clearExistingWorkout();
    clearWorkout();
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
        setIsLoading(false);
      }
    };
    renderUserWorkouts();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="pages-Div" style={{paddingBottom:"5em"}}>
      <div className="list_title">
        <h2>Your workouts</h2>
      </div>
      <WorkoutList workouts={userWorkouts} isLoading={isLoading}></WorkoutList>
      <div className="list_title">
        <h2>Here are some recomendations</h2>
      </div>
      <WorkoutList workouts={publicWorkouts} isLoading={isLoading}></WorkoutList>
      <div className="list_title">
        <h2>Your challenges</h2>
      </div>
      <WorkoutList workouts={publicWorkouts} isLoading={isLoading}></WorkoutList>
      <div className="list_title">
        <h2 style={{marginBottom:"1em"}}>Send a challenge</h2>
      </div>
      <SendChallenge />
      <Button
        id="new_workout_btn"
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
