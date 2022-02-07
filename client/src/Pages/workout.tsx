import React, { createRef, ReactNode, useEffect, useState, useRef, useContext } from "react";
import "./pages.less";
import { Steps, message, Avatar } from "antd";
import { ISet, IWorkoutContext } from "../interfaces";
import WebcamAI from "../Components/webcamAI";
import { iconSelector } from "../Components/icons";
import SaveWorkout from "../Components/saveWorkout";
import modelsByType from "../Services/modelService";
import { WorkoutContext } from "../Context/workoutProvider";
import sound from "../Services/soundService";
import ProgressBar from "../Components/progressBar";
import Countdown from "antd/lib/statistic/Countdown";
import { useStateWithLocalStorage } from "../Services/customHookService";

const { Step } = Steps;

const Workout: React.FC = () => {
  const { workout, existingWorkout } = useContext<IWorkoutContext>(WorkoutContext);
  const [isLoading, setIsLoading] = useState(true);
  const [current, setCurrent] = useStateWithLocalStorage("current");
  const [repCount, setRepCount] = useStateWithLocalStorage("repCount");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [rest, setRest] = useState<boolean>(false);
  const isResting = useRef(false);
  const isFinished = useRef(false);
  const currentStepRef = createRef<HTMLDivElement>();
  const [sets, setSets] = useState<ISet[]>([]);
  const [URL, setURL] = useState("");

  useEffect(() => {
    if (workout.length > 0) {
      setSets(workout);
    } else {
      if (existingWorkout) {
        setSets(existingWorkout.workout);
      }
    }
    setIsLoading(false);
  }, [workout, existingWorkout]);

  useEffect(() => {
    if (!isLoading) {
      const renderNextSet = (): void => {
        setRepCount(0);
        renderRest(sets[current].rest);
        setCurrent((prev) => prev + 1);
      };
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
      if (repCount === sets[current].reps && current < sets.length - 1) {
        renderNextSet();
      } else if (repCount === sets[current].reps && current === sets.length - 1) {
        renderFinishedWorkout();
      }
    }
  }, [repCount, current, sets, setRepCount, setCurrent, setRest]);

  useEffect(() => {
    if (!isLoading) {
      //URL.current = modelsByType[sets[current].exer]
      setURL(modelsByType[sets[current].exer]);
    }
  }, [current, sets]);

  const renderFinishedWorkout = (): void => {
    message.success("What a great workout! Nicely done!");
    isFinished.current = true;
    setIsModalVisible(true);
  };

  const generateStepItems = (): ReactNode => {
    return sets.map((item, i, array) => {
      function setIcon() {
        let Icon = iconSelector(item.exer);
        if (sets.indexOf(item) === current) {
          return <Avatar style={{ backgroundColor: "#2A9D8F ", color: "white" }} icon={<Icon />} />;
        } else if (sets.indexOf(item) < current) {
          return <Avatar style={{ border: "1px solid #2A9D8F", color: "white" }} icon={<Icon />} />;
        }
        return <Avatar style={{ backgroundColor: "#lightgray", color: "white" }} icon={<Icon />} />;
      }
      let lastClass = "";
      if (i === 0) lastClass = " ant-first";
      if (i === array.length - 1) lastClass = " ant-last";
      if (array.length === 1) lastClass = " ant-only";
      if (sets.indexOf(item) === current) {
        return (
          <div key={i} className={"ant-steps-item ant-steps" + lastClass}>
            <div id="step-anchor" ref={currentStepRef}></div>
            <Step icon={setIcon()} />
          </div>
        );
      }

      return <Step className={lastClass} icon={setIcon()} key={i} />;
    });
  };

  function beep(): void {
    sound.play();
  }

  const incrementRepCount = (): void => {
    if (!isResting.current) {
      setRepCount((prev) => prev + 1);
      beep();
    }
  };

  useEffect(() => {
    currentStepRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "start" });
  }, [currentStepRef]);

  return isLoading ? (
    <p>loading</p>
  ) : (
    <div className="workout-Div">
      <div className="steps-Div">
        <Steps current={current} responsive={false}>
          {generateStepItems()}
        </Steps>
      </div>
      <div className="workoutContent-Div">
        <div className="steps-content">
          <WebcamAI incrementRepCount={incrementRepCount} URL={URL} isResting={rest} isFinished={isFinished.current} />
        </div>
        <div className="set-info">
          {!isResting.current || !rest ? (
            <div>
              <p className="set-info-current">Current set:</p>
              <p className="set-info-current">
                Completed ({repCount}/{sets[current].reps}) reps of {sets[current].exer}
              </p>
            </div>
          ) : (
            <div>
              <p>Take a moment to grab a glass of water.</p>

              <Countdown title={"Your workout will continue in:"} value={Date.now() + 60000 * sets[current - 1].rest} />
            </div>
          )}
          {!rest && repCount < sets[current].reps && <ProgressBar progress={(repCount / sets[current].reps) * 100} />}
          {sets.length > 1 && current !== sets.length - 1 ? (
            <p>
              {" "}
              Up next: {sets[current + 1].reps} reps of {sets[current + 1].exer}
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
