import { InfoCircleOutlined } from "@ant-design/icons";
import { Avatar, Image, Button } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { IChallenge, IWorkoutContext } from "../interfaces";
import { challengeComplete } from "../Services/challengesService";
import "./components.less";

type WorkoutItemProps = {
  challenge: IChallenge;
};

const ChallengeItem: React.FC<WorkoutItemProps> = ({ challenge }) => {
  const { storeWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const navigate = useNavigate();

  const startWorkout = async(): Promise<void> => {
    storeWorkout(challenge.workout);
    await challengeComplete(challenge.id)
    navigate("/workout");
  };

  const challengeDetails = (): void => {
    navigate(`/challenge/${challenge.id}`);
  };

  return (
    <div className="workout_container">
      <div className="workout_headline"></div>
      <div className="workout_info">
        <h4 className="workout_info_name">Received from:</h4>
        <h4 className="workout_info_name">{challenge.from}</h4>
        <div className="avatar-div">
      <Avatar
        src={challenge.from_photo !== "" && (<Image src={challenge.from_photo} style={{ width: 32 }} preview={false} />)}
      >
        {!challenge.from_photo && `${challenge.from.charAt(0).toUpperCase()}`}
        </Avatar>
    </div>
        <h5>{challenge.message}</h5>
        <Button type="text" id="startworkoutButton" onClick={startWorkout}>
          Start challenge
        </Button>

        <InfoCircleOutlined
          onClick={challengeDetails}
          style={{ position: "absolute", top: "0.5em", right: "0.5em", fontSize: "x-large" }}
        />
      </div>
    </div>
  );
};

export default ChallengeItem;
