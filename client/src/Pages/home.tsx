import { Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserWorkouts } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import {  IChallenge, IWorkout, IWorkoutContext } from "../interfaces";
import WorkoutList from "../Components/workoutList";
import { WorkoutContext } from "../Context/workoutProvider";
import SendChallenge from "../Components/sendChallenge";
import Challenges from "../Components/challenges";
import { getChallengesByUserId } from "../Services/challengesService";
import SendChallengeModal from "../Components/sendChallengeModal";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);
  const [userWorkouts, setUserWorkouts] = useState<IWorkout[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<IWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [challengeWorkouts, setchallengeWorkouts] = useState<IChallenge[]>([]);
  const { clearWorkout, clearExistingWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    let mounted = true;
    clearExistingWorkout();
    clearWorkout();
    const renderUserWorkouts = async () => {
      let userData;
      let publicData;
      let challenges;
      if (user && mounted) {
        userData = await getUserWorkouts(user!.uid);
        publicData = await getUserWorkouts("public");
        challenges = await getChallengesByUserId(user.uid)
      }
      if (userData && publicData && challenges && mounted) {
        setUserWorkouts([...userWorkouts, ...userData]);
        setPublicWorkouts([...publicWorkouts, ...publicData]);
        setchallengeWorkouts([...challengeWorkouts, ...challenges])
        setIsLoading(false);
      }
    };
    renderUserWorkouts();
    return () => {
      mounted = false;
    };
  }, [user]);
console.log(challengeWorkouts)
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
          <Button type="primary" onClick={showModal}>
        Send a challenge
      </Button>
      </div>
      <Challenges challenges={challengeWorkouts} isLoading={isLoading}/>
      <Button
        id="new_workout_btn"
        size="large"
        onClick={() => {
          navigate("createworkout");
        }}>
        Create a new workout
      </Button>
      <SendChallengeModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>

    </div>
  );
};

export default Home;
