import { MessageOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { iconSelector } from "../Components/icons";
import { IChallenge } from "../interfaces";
import AuthService from "../Services/authService";
import { getChallengeId } from "../Services/challengesService";
import "./pages.less";

type Params = {
  id: string;
};

const ChallengeSummary: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);
  const { id } = useParams<Params>();
  const [challenge, setChallenge] = useState<IChallenge | null>(null);

  function returnHome(): void {
    navigate("/");
  }

  useEffect(() => {
    if (id && user) {
      getChallengeId(user.uid, id).then((res) => {
        if (res) {
          setChallenge((prev) => res[0]);
        }
      });
    }
  }, []);

  return challenge ? (
    <div className="page-Div">
      <div className="challengeSummary">
        <h2>Challenge from {challenge.from}</h2>
        <div className="message">
          <MessageOutlined style={{ fontSize: "x-large" }} />
          <p className="message_text">{challenge.message}</p>
        </div>
        <h3>The workout is:</h3>
        {challenge.workout.map((set) => {
          let Icon = iconSelector(set.exer);
          return (
            <div className="challenge_sets">
              <div className="icon_container">
                <Avatar icon={<Icon />} />
              </div>
              <p>
                {set.reps} repetition{set.reps > 1 && "s"} of {set.exer}{" "}
                {set.rest > 0 ? `with a ${set.rest} minute rest` : "with no rest"}
              </p>
            </div>
          );
        })}
      </div>
      <Button onClick={returnHome}>Return to home</Button>
    </div>
  ) : null;
};

export default ChallengeSummary;
