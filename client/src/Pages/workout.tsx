import React, { ReactNode } from "react";
import "./pages.css";
import { Steps, Button, message, Avatar } from "antd";
import { ISet } from "../interfaces";
import WebcamAI from "../Components/webcamAI";
import { iconSelector } from "../Components/icons";
import SaveWorkout from "../Components/saveWorkout";

const { Step } = Steps;

type WorkoutProps = {
  workout: ISet[];
};

const Workout: React.FC<WorkoutProps> = ({ workout }) => {
  const [current, setCurrent] = React.useState(0);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
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
      return <Step icon={setIcon()} key={item.exer} />;
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="workout-Div">
      <div className="steps-Div">
        <Steps current={current} responsive={false}>
          {generateStepItems()}
        </Steps>
      </div>
      <div className="workoutContent-Div">
        <div className="steps-content">
          <WebcamAI />
        </div>
        <div className="set-info">
          <p className="set-info-current">Current set:</p>
          <p className="set-info-current">
            {workout[current].reps} reps of {workout[current].exer}s
          </p>
          {workout.length > 1 && current !== workout.length - 1 ? (
            <p>
              {" "}
              Up next: {workout[current + 1].reps} reps of {workout[current + 1].exer}s
            </p>
          ) : null}
        </div>
        <div className="steps-action">
          {current < workout.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === workout.length - 1 && (
            <Button
              type="primary"
              onClick={() => {
                message.success("Processing complete!");
                // setIsModalVisible(true);
                showModal();
              }}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
          {/* <SaveWorkout trigger={popup} setTrigger={setPopup}>
            <h3>Do you want to save this workout?</h3>
          </SaveWorkout> */}
          <SaveWorkout
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            workout={workout}></SaveWorkout>
        </div>
      </div>
    </div>
  );
};

export default Workout;
