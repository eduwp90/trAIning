import { Button } from "antd";
import React from "react";
import "./components.less";

type OverlayProps = {
  startExercise: Function;
  status: string;
};

const WebcamOverlay: React.FC<OverlayProps> = ({ startExercise, status }) => {
  const renderOverlay = function (): JSX.Element {
    switch (status) {
      case "NOT STARTED":
        return (
          <>
            <h3>Make sure your entire body is visible</h3>
            <span>Click start when ready</span>
            <p> </p>
            <Button type="primary" onClick={() => startExercise()}>
              START
            </Button>
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
