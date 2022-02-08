import { InfoCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { IWorkout, IWorkoutContext } from "../interfaces";
import "./components.less";

type WorkoutItemProps = {
  workout: IWorkout;
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout }) => {
  const { storeExistingWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const navigate = useNavigate();

  const startWorkout = (): void => {
    storeExistingWorkout(workout);
    navigate("/workout");
  };

  const editWorkout = (): void => {
    storeExistingWorkout(workout);
    navigate("/summary");
  };

  return (
    <div className="workout_container">
      <div className="workout_headline"></div>
      <div className="workout_info">
        <h4 className="workout_info_name">{workout.name}</h4>
        {workout.time && (
          <h5 className="workout_info_time">
            <img src="https://img.icons8.com/ios-glyphs/30/000000/timer.png" style={{ height: "15px" }} alt="" />{" "}
            {workout.time} min
          </h5>
        )}
        {workout.calories && (
          <h5 className="workout_info_calories">
            <img
              src="https://img.icons8.com/ios-glyphs/30/000000/fire-element--v1.png"
              style={{ height: "16px" }}
              alt=""
            />{" "}
            {workout.calories} Kcals
          </h5>
        )}
        <Button type="text" id="startworkoutButton" onClick={startWorkout}>
          Start workout
        </Button>

        <InfoCircleOutlined
          onClick={editWorkout}
          style={{ position: "absolute", top: "0.5em", right: "0.5em", fontSize: "x-large" }}
        />
      </div>
    </div>
  );
};

export default WorkoutItem;
