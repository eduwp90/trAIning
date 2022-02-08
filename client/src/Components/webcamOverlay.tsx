import { Button } from "antd";
import Countdown from "antd/lib/statistic/Countdown";
import React, { useState } from "react";
import "./components.less";

type OverlayProps = {
  startExercise: Function;
  status: string;
};

const WebcamOverlay: React.FC<OverlayProps> = ({ startExercise, status }) => {
  const [starting, setStarting] = useState<boolean>(false);

  const startingfunc = (): void => {
    setStarting(true);
    setTimeout(function () {
      startExercise();
      setStarting(false);
    }, 3500);
  };

  const renderOverlay = function (): JSX.Element {
    switch (status) {
      case "NOT STARTED":
        return (
          <>
            <h3>Make sure your entire body is visible</h3>
            <span className="instructions">Click start when ready</span>
            {starting ? (
              <Countdown title="Starting in:" value={Date.now() + 3500} />
            ) : (
              <Button type="primary" onClick={() => startingfunc()}>
                START
              </Button>
            )}
          </>
        );
      case "RESTING":
        return <h1>REST TIME</h1>;
      case "FINISHED":
        return <h1>WORKOUT DONE</h1>;

      default:
        return <></>;
    }
  };

  return <div className={status === "RUNNING" ? "overlay-container-hide" : "overlay-container"}>{renderOverlay()}</div>;
};

export default WebcamOverlay;
