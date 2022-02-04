import React, { createRef, ReactNode, useEffect, useState, useRef, useContext } from "react";
import "./pages.less";
import { Steps, message, Avatar } from "antd";
import { IWorkoutContext } from "../interfaces";
import WebcamAI from "../Components/webcamAI";
import { iconSelector } from "../Components/icons";
import SaveWorkout from "../Components/saveWorkout";
import modelsByType from "../Services/modelService";
import { WorkoutContext } from "../Context/workoutProvider";
import sound from "../Services/soundService";
import ProgressBar from "../Components/progressBar";
import Countdown from "antd/lib/statistic/Countdown";
import useStateWithLocalStorage from "../Services/customHookService";

const { Step } = Steps;

const Workout: React.FC = () => {
  const { workout } = useContext<IWorkoutContext>(WorkoutContext);
  const [current, setCurrent] = useStateWithLocalStorage("current");
  const [repCount, setRepCount] = useStateWithLocalStorage("repCount");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [rest, setRest] = useState<boolean>(false);
  const isResting = useRef(false);
  const currentStepRef = createRef<HTMLDivElement>();
  const URL = useRef(modelsByType[workout[current].exer]);

  useEffect(() => {
    if (repCount === workout[current].reps && current < workout.length - 1) {
      setCurrent((prev) => prev + 1);
      setRepCount(0);
      renderRest(workout[current].rest);
    } else if (repCount === workout[current].reps && current === workout.length - 1) {
      message.success("What a great workout! Nicely done!");
      setIsModalVisible(true);
    }
  }, [repCount, current, workout]);

  useEffect(() => {
    URL.current = modelsByType[workout[current].exer];
  }, [current, workout]);

  const renderRest = (time: number): void => {
    if (time > 0) {
      setRest(true);
      isResting.current = true;
      setTimeout(() => {
        setRest(false);
        isResting.current = false;
      }, time * 60000);
    }
  };

  const generateStepItems = (): ReactNode => {
    return workout.map((item) => {
      function setIcon() {
        let Icon = iconSelector(item.exer);
        if (workout.indexOf(item) === current) {
          return <Avatar style={{ backgroundColor: "#2A9D8F ", color: "white" }} icon={<Icon />} />;
        } else if (workout.indexOf(item) < current) {
          return <Avatar style={{ border: "1px solid #2A9D8F", color: "white" }} icon={<Icon />} />;
        }
        return <Avatar style={{ backgroundColor: "#lightgray", color: "white" }} icon={<Icon />} />;
      }
      if (workout.indexOf(item) === current) {
        return (
          <div className="ant-steps-item ant-steps" ref={currentStepRef}>
            <Step icon={setIcon()} key={item.exer} />
          </div>
        );
      }

      return <Step icon={setIcon()} key={item.exer} />;
    });
  };

  function beep(): void {
    sound.play();
  }

  const incrementRepCount = (): void => {
    if (!isResting.current) {
      setRepCount((prev) => prev + 1);
      console.log("isResting? inside closure ", isResting.current);
      beep();
    }
  };

  useEffect(() => {
    currentStepRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
  }, [currentStepRef]);

  return (
    <div className="workout-Div">
      <div className="steps-Div">
        <Steps current={current} responsive={false}>
          {generateStepItems()}
        </Steps>
      </div>
      <div className="workoutContent-Div">
        <div className="steps-content">
          <WebcamAI incrementRepCount={incrementRepCount} URL={URL} />
        </div>
        <div className="set-info">
          {!isResting.current || !rest ? (
            <div>
              <p className="set-info-current">Current set:</p>
              <p className="set-info-current">
                Completed ({repCount}/{workout[current].reps}) reps of {workout[current].exer}
              </p>
            </div>
          ) : (
            <div>
              <p>Take a moment to grab a glass of water.</p>

              <Countdown
                title={"Your workout will continue in:"}
                value={Date.now() + 60000 * workout[current - 1].rest}
              />
            </div>
          )}
          {!rest && repCount < workout[current].reps && (
            <ProgressBar progress={(repCount / workout[current].reps) * 100} />
          )}
          {workout.length > 1 && current !== workout.length - 1 ? (
            <p>
              {" "}
              Up next: {workout[current + 1].reps} reps of {workout[current + 1].exer}
            </p>
          ) : null}
        </div>

        <div className="steps-action">
          <SaveWorkout isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </div>
      </div>
    </div>
  );
};

export default Workout;
