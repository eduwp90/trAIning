import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {  IChallenge, ISet, IWorkout } from '../interfaces';
import AuthService from '../Services/authService';
import { getChallengesByUserId } from '../Services/challengesService';

import WorkoutItem from './workoutItem';

type ChallengesProps = {
  challenges: IChallenge[];
  isLoading: boolean
}
const Challenges: React.FC<ChallengesProps> = ({ challenges, isLoading }) => {

  return (
    <div className="workout_list">
      <div className="workout_scroll">{challenges.map((challenge: IChallenge, index) => {
    return <WorkoutItem workout={challenge} key={index}/>;
 })}</div>
  </div>);
}

export default Challenges;
