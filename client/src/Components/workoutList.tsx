import React from "react";
import WorkoutItem from "./workoutItem";
import { IWorkout } from "../interfaces";
import "./components.less";

type WorkoutListProps = {
  workouts: IWorkout[];
};

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
  const workoutItems = workouts.map((workout: IWorkout) => {
    return <WorkoutItem workout={workout} key={workouts.indexOf(workout)}></WorkoutItem>;
  });

  return (
    <div className="workout_list">
      <div className="workout_scroll">{workoutItems}</div>
    </div>
  );
};

export default WorkoutList;
