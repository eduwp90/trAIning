import React, { createRef, ReactNode, useEffect } from "react";
import "./pages.less";
import { Steps, Button, message, Avatar } from "antd";
import { ISet } from "../interfaces";
import WebcamAI from "../Components/webcamAI";
import { iconSelector } from "../Components/icons";
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
const currentStepRef = createRef<HTMLDivElement>()
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

  const generateStepItems = (): ReactNode => {
    return workout.map((item) => {
      function setIcon() {
        let I = iconSelector(item.exer);
        if (workout.indexOf(item) === current) {
          return <Avatar style={{ backgroundColor: "green", color: "white" }} icon={<I />} />;
        } else if (workout.indexOf(item) < current) {
          return <Avatar style={{ backgroundColor: "lightgray", color: "white" }} icon={<I />} />;
        } else {
          return <Avatar style={{ backgroundColor: "grey", color: "white" }} icon={<I />} />;
        }
      }
      if (workout.indexOf(item) === current) {

        return <div className='ant-steps-item ant-steps' ref={currentStepRef}><Step icon={setIcon()} key={item.exer} /></div>;
       }

      return <Step icon={setIcon()} key={item.exer} />;
    });
  };

  useEffect(() => {
    currentStepRef.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "center"})
  }, [currentStepRef])

  return (
    <div className="workout-Div">
      <div className="steps-Div">
        <Steps current={current} responsive={false}>
          {generateStepItems()}
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
