import React, { useEffect, useState } from 'react';
import { IChallengeWorout, IWorkout } from '../interfaces';
import { getWorkout } from '../Services/dbService';
import WorkoutItem from './workoutItem';

type ChallengesProps = {
  challenges: IChallengeWorout[];
  isLoading: boolean
}
const Challenges: React.FC<ChallengesProps> = ({ challenges, isLoading }) => {
  const [workouts, setWorkout] = useState<IWorkout[]>([]);


  useEffect(() => {
    challenges.map((challenge) => {
      return getWorkout(challenge.id)
        .then(response => {
          if (response) {
          setWorkout(prev =>[...prev, ...response])
        }
      })
    })
  }, [challenges])
  return (
    <div className="workout_list">
      <div className="workout_scroll">{workouts.map((workout: IWorkout, index) => {
    return <WorkoutItem workout={workout} key={index}/>;
 })}</div>
  </div>);
}

export default Challenges;
