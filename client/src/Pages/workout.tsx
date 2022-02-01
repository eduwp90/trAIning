import React from "react";
import "./pages.css";
import { Steps, Button, message } from "antd";
import { ISet } from "../interfaces";
import WebcamAI from "../Components/webcamAI";
import SaveWorkout from "../Components/saveWorkout";
import WorkoutsContext from "../workoutContext";

const { Step } = Steps;

type WorkoutProps = {
  workout: ISet[];
};

const Workout: React.FC<WorkoutProps> = ({ workout }) => {
  const [current, setCurrent] = React.useState(0);
  const [repCount, setRepCount] = React.useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  // const [isResting, setIsResting] = React.useState(false);

  const { isResting, setIsResting } = React.useContext(WorkoutsContext);

  React.useEffect(() => {
    if (repCount === workout[current].reps && current < workout.length - 1) {
      console.log("reps", repCount);
      setCurrent((prev) => prev + 1);
      setRepCount(0);
      renderRest(workout[current].rest);
    } else if (repCount === workout[current].reps && current === workout.length - 1) {
      message.success("What a great workout! Nicely done!");
      setIsModalVisible(true);
    }
  }, [repCount]);

  const prev = (): void => {
    setCurrent((prev) => prev - 1);
  };

  const renderRest = (time: number) => {
    setIsResting(true);
    setTimeout(() => {
      setIsResting(false);
    }, time * 60000);
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
          {!isResting ? (
            <div>
              <p className="set-info-current">Current set:</p>
              <p className="set-info-current">
                Completed ({repCount}/{workout[current].reps}) reps of {workout[current].exer}s
              </p>
            </div>
          ) : (
            <div>
              <p>Take a moment to grab a glass of water.</p>
              <p>
                Your workout will continue in {workout[current - 1].rest} minute
                {workout[current - 1].rest > 1 ? "s" : ""}
              </p>
            </div>
          )}
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
