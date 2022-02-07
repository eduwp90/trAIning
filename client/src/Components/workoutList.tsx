import React from "react";
import WorkoutItem from "./workoutItem";
import { IWorkout } from "../interfaces";
import "./components.less";
import LoadingContent from "./loadingContent";
import EmptyContent from "./emptyContent";

type WorkoutListProps = {
  workouts: IWorkout[];
  isLoading: boolean;
};

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, isLoading }) => {
  const workoutItems = workouts.map((workout: IWorkout) => {
    return <WorkoutItem workout={workout} key={workouts.indexOf(workout)}></WorkoutItem>;
  });

  return (
    <div className="workout_list">
      {isLoading ? (
        <LoadingContent />
      ) : !workouts.length ? (
        <EmptyContent />
      ) : (
        <div className="workout_scroll">{workoutItems}</div>
      )}
    </div>
  );
};

export default WorkoutList;
