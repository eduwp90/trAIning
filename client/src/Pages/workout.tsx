import React from "react";
import "./pages.css";
import { Steps, Button, message } from "antd";
import { ISet } from "../interfaces";
import WebcamAI from "../Components/webcamAI";
import SaveWorkout from "../Components/saveWorkout";

const { Step } = Steps;

type WorkoutProps = {
  workout: ISet[];
};

const Workout: React.FC<WorkoutProps> = ({ workout }) => {
  const [current, setCurrent] = React.useState(0);
  const [repCount, setRepCount] = React.useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  React.useEffect(() => {
    console.log("got here");
    console.log("rep count", repCount);
    if (repCount === workout[current].reps && current < workout.length - 1) {
      setCurrent((prev) => prev + 1);
      setRepCount(0);
    } else if (repCount === workout[current].reps && current === workout.length - 1) {
      message.success("What a great workout! Nicely done!");
      setIsModalVisible(true);
    }
  }, [repCount]);

  const prev = (): void => {
    setCurrent((prev) => prev - 1);
  };

  return (
    <div className="workout-Div">
      <div className="steps-Div">
        <Steps current={current} responsive={false}>
          {workout.map((item) => (
            <Step key={item.exer} />
          ))}
        </Steps>
      </div>
      <div className="workoutContent-Div">
        <div className="steps-content">
          <WebcamAI setRepCount={setRepCount} />
        </div>
        <div className="set-info">
          <p className="set-info-current">Current set:</p>
          <p className="set-info-current">
            Completed ({repCount}/{workout[current].reps}) reps of {workout[current].exer}s
          </p>
          {workout.length > 1 && current !== workout.length - 1 ? (
            <p>
              {" "}
              Up next: {workout[current + 1].reps} reps of {workout[current + 1].exer}s
            </p>
          ) : null}
        </div>
        <div className="steps-action">
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          <SaveWorkout isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} workout={workout} />
        </div>
      </div>
    </div>
  );
};

export default Workout;
