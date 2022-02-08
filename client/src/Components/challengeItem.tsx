import { InfoCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { IChallenge, IWorkout, IWorkoutContext } from "../interfaces";
import "./components.less";

type WorkoutItemProps = {
  challenge: IChallenge;
};

const ChallengeItem: React.FC<WorkoutItemProps> = ({ challenge }) => {
  const { storeExistingWorkout, storeWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const navigate = useNavigate();

  const startWorkout = (): void => {

    storeWorkout(challenge.workout_id);
    navigate("/workout");
  };

  const editWorkout = (): void => {
    // storeExistingWorkout(workout);
    // navigate("/summary");
  };

  return (
    <div className="workout_container">
      <div className="workout_headline"></div>
      <div className="workout_info">
        <h4 className="workout_info_name">Received from:</h4>
        <h4 className="workout_info_name">{challenge.from}</h4>
        <h5>{challenge.message}</h5>
        <Button type="text" id="startworkoutButton" onClick={startWorkout}>
          Start challenge
        </Button>

        <InfoCircleOutlined
          onClick={editWorkout}
          style={{ position: "absolute", top: "0.5em", right: "0.5em", fontSize: "x-large" }}
        />
      </div>
    </div>
  );
};

export default ChallengeItem;
