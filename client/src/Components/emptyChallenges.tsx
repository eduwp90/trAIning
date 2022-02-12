import { StopOutlined } from "@ant-design/icons";
import React from "react";

const EmptyChallenges: React.FC = () => {
  return (
    <div className="center_div">
      <StopOutlined style={{ fontSize: "50px", color: "lightgray", marginBottom: "1rem" }} />
      You havent recieved any challenges yet
    </div>
  );
};
export default EmptyChallenges;
