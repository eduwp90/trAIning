import { Button } from "antd";
import React from "react";
import "./components.less";

const WebcamOverlay: React.FC = () => {
  return (
    <div className="overlay-container">
      <Button>START</Button>
    </div>
  );
};

export default WebcamOverlay;
