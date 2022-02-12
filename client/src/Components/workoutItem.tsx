import { ClockCircleOutlined, FireOutlined, FireTwoTone, HeartFilled, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Rate } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { calculateWorkoutDifficulty } from "../helpers";
import { IWorkout, IWorkoutContext } from "../interfaces";
import "./components.less";
import { BsFillCircleFill } from "react-icons/bs";

type WorkoutItemProps = {
  workout: IWorkout;
};

const WorkoutItem: React.FC<WorkoutItemProps> = ({ workout }) => {
  const { storeExistingWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    e.stopPropagation();
    e.target.id.includes("start") ? startWorkout() : editWorkout();
  };

  const startWorkout = (): void => {
    storeExistingWorkout(workout);
    navigate("/workout");
  };

  const editWorkout = (): void => {
    storeExistingWorkout(workout);
    navigate("/summary");
  };

  function colorByDifficulty() {
    const difficulty = calculateWorkoutDifficulty(workout.workout);
    if (difficulty < 2) return "#2A9D8F";
    if (difficulty < 4) return "#E9C46A";
    return "#E76F51";
  }

  return (
    <div className="workout_container" onClick={handleClick}>
      <div className="workout_headline">
        <h3 className="workout_info_name">{workout.name}</h3>
      </div>
      <div className="workout_info">
        {workout.time && (
          <h4 className="workout_info_time">
            <ClockCircleOutlined style={{ color: "grey" }} /> {workout.time} min
          </h4>
        )}
        {workout.calories && (
          <h4 className="workout_info_calories">
            <FireOutlined style={{ color: "grey" }} /> {workout.calories} Kcals
          </h4>
        )}
        <h4 className="workout_info_difficulty">
          Difficulty
          <Rate
            disabled
            defaultValue={calculateWorkoutDifficulty(workout.workout)}
            allowHalf={true}
            character={<BsFillCircleFill />}
            style={{ color: colorByDifficulty(), fontSize: 14, verticalAlign: "text-top", marginTop: "3px" }}
          />
        </h4>
        <Button type="text" id="startworkoutButton" onClick={handleClick}>
          {<img id="start" className="play_btn" alt="" src="https://img.icons8.com/plumpy/24/000000/play--v1.png" />}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutItem;
