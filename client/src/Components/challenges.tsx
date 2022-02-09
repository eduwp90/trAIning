import React from "react";
import { IChallenge } from "../interfaces";
import ChallengeItem from "./challengeItem";

type ChallengesProps = {
  challenges: IChallenge[];
  isLoading: boolean;
};
const Challenges: React.FC<ChallengesProps> = ({ challenges, isLoading }) => {
  return (
    <div className="workout_list">
      {/* {(!isLoading && challenges.length === 0) ? :} */}
      <div className="workout_scroll">
        {challenges.map((challenge: IChallenge, index) => {
          return <ChallengeItem challenge={challenge} key={index} />;
        })}
      </div>
    </div>
  );
};

const EmptyChallenges: React.FC = () => {
  return <div></div>;
};

export default Challenges;
