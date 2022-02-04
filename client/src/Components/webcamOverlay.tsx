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
          <div className="overlay-container">
            <Button onClick={startExercise()}>START</Button>
          </div>
        );
      case "RESTING":
        return (
          <div className="overlay-container">
            <Button onClick={startExercise()}>START</Button>
          </div>
        );
      case "FINISHED":
        return (
          <div className="overlay-container">
            <Button onClick={startExercise()}>START</Button>
          </div>
        );

      default:
        return <></>;
    }
  };

  return <>{renderOverlay}</>;
};

export default WebcamOverlay;
