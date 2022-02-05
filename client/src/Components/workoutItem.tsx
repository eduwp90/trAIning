import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
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
  const { storeExistingWorkout } = useContext<IWorkoutContext>(WorkoutContext)
  const navigate = useNavigate()

  const startWorkout = (): void => {
   storeExistingWorkout(workout)
    navigate("/workout")
  }

  const editWorkout = (): void => {
    storeExistingWorkout(workout)
    navigate("/summary")
  }

  return (
    <div className="workout_container" onClick={editWorkout}>
      <div className="workout_headline"></div>
      <div className="workout_info">
        <h4 className="workout_info_name">{workout.name}</h4>
        <h5 className="workout_info_exercise">{workout.workout[0].exer}</h5>
        <Button  type="text" className="startworkoutButton" onClick={startWorkout}>Start workout</Button>
        {/* <EditOutlined style={{ position: "absolute", top: "1em", right: "1em" }} /> */}
        <InfoCircleOutlined style={{ position: "absolute", top: "1em", right: "1em" }}/>
      </div>
    </div>
  );
};

export default WorkoutItem;
