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
        {workout.time && <h5 className="workout_info_time">Duration: {workout.time} min</h5>}
        {workout.calories && <h5 className="workout_info_calories">Est. calories: {workout.calories} Kcals</h5>}
      </div>
    </div>
  );
};

export default WorkoutItem;
