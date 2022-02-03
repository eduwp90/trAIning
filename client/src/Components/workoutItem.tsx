import React from "react";
import { IWorkout } from "../interfaces";
import "./components.less";

type WorkoutItemProps = {
  workout: IWorkout;
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout }) => {
  return (
    <div className="workout_container">
      <div className="workout_headline"></div>
      <div className="workout_info">
        <h4 className="workout_info_name">{workout.name}</h4>
        <h5 className="workout_info_exercise">{workout.workout[0].exer}</h5>
      </div>
    </div>
  );
};

export default WorkoutItem;
