// import { InfoCircleOutlined } from "@ant-design/icons";
import { Avatar, Image, Button } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { IChallenge, IWorkoutContext } from "../interfaces";
import "./components.less";

type WorkoutItemProps = {
  challenge: IChallenge;
};

const ChallengeItem: React.FC<WorkoutItemProps> = ({ challenge }) => {
  const { storeWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const navigate = useNavigate();

  const startWorkout = (): void => {
    storeWorkout(challenge.workout);
    navigate("/workout");
  };

  const challengeDetails = (): void => {
    navigate(`/challenge/${challenge.id}`);
  };

  return (
    <div className="challenge_container" onClick={challengeDetails}>
      <div className="challenge_headline">
        <div className="challenge_avatar">
          <Avatar
            size={80}
            src={
              challenge.from_photo !== "" && <Image src={challenge.from_photo} style={{ width: 32 }} preview={false} />
            }>
            {!challenge.from_photo && `${challenge.from.charAt(0).toUpperCase()}`}
          </Avatar>
        </div>
        <div className="challenge_name">
          {challenge.from}
          <div className="challenge_message">⏤ {challenge.message}</div>
        </div>
      </div>
      <div className="challenge_info">
        <div>{challenge.workout[0]}</div>
        <Button type="text" id="startworkoutButton" onClick={startWorkout}>
          {
            <img
              className="play_btn"
              alt=""
              src="https://img.icons8.com/external-bearicons-glyph-bearicons/64/000000/external-play-call-to-action-bearicons-glyph-bearicons.png"
            />
          }
        </Button>

        {/* <InfoCircleOutlined
          onClick={challengeDetails}
          style={{ position: "absolute", top: "0.5em", right: "0.5em", fontSize: "x-large" }}
        /> */}
      </div>
    </div>
  );
};

export default ChallengeItem;
