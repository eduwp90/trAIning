// import { InfoCircleOutlined } from "@ant-design/icons";
import { BsFillCircleFill } from "react-icons/bs";
import { Avatar, Image, Button, Rate } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { calculateWorkoutCalories, calculateWorkoutDifficulty, calculateWorkoutTime } from "../helpers";
import { IChallenge, IWorkoutContext } from "../interfaces";
import { ClockCircleOutlined, FireOutlined, FireTwoTone, HeartFilled, InfoCircleOutlined } from "@ant-design/icons";
import { challengeComplete } from "../Services/challengesService";
import "./components.less";

type WorkoutItemProps = {
  challenge: IChallenge;
};

const ChallengeItem: React.FC<WorkoutItemProps> = ({ challenge }) => {
  const { storeWorkout, userProfile } = useContext<IWorkoutContext>(WorkoutContext);
  const navigate = useNavigate();

  const startWorkout = async(): Promise<void> => {
    storeWorkout(challenge.workout);
    await challengeComplete(challenge.id)
    navigate("/workout");
  };

  const challengeDetails = (): void => {
    navigate(`/challenge/${challenge.id}`);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.target.id === "start" ? startWorkout() : challengeDetails();
  };

  const time = calculateWorkoutTime(challenge.workout);
  const calories = calculateWorkoutCalories(challenge.workout, userProfile!, time);

  function colorByDifficulty() {
    const difficulty = calculateWorkoutDifficulty(challenge.workout);
    if (difficulty < 2) return "#2A9D8F";
    if (difficulty < 4) return "#E9C46A";
    return "#E76F51";
  }

  return (
    <div className="challenge_container" onClick={handleClick}>
      <div className="challenge_headline">
        <div className="challenge_avatar">
          <Avatar size={80} src={challenge.from_photo !== "" && <Image src={challenge.from_photo} preview={false} />}>
            {!challenge.from_photo && `${challenge.from.charAt(0).toUpperCase()}`}
          </Avatar>
        </div>
        <div className="challenge_name">
          {challenge.from}
          <div className="challenge_message">⏤ {challenge.message}</div>
        </div>
      </div>
      <div className="challenge_info">
        <div className="challenge_stats">
          {time && (
            <h5 className="challenge_info_time">
              <ClockCircleOutlined style={{ color: "grey" }} /> {time} min
            </h5>
          )}
          {calories && (
            <h5 className="challenge_info_calories">
              <FireOutlined style={{ color: "grey" }} /> {calories} Kcals
            </h5>
          )}
        </div>
        <div className="challenge_difficulty">
          <h5>
            Difficulty{"  "}
            <Rate
              disabled
              defaultValue={calculateWorkoutDifficulty(challenge.workout)}
              allowHalf={true}
              character={<BsFillCircleFill />}
              style={{ color: colorByDifficulty(), fontSize: 20, verticalAlign: "text-top" }}
            />
          </h5>
        </div>
        <Button name="start" type="text" id="startworkoutButton" onClick={handleClick}>
          Start{"  "}
          {<img id="start" className="play_btn" alt="" src="https://img.icons8.com/plumpy/24/000000/play--v1.png" />}
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
