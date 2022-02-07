import React from "react";
import WorkoutItem from "./workoutItem";
import { IWorkout } from "../interfaces";
import "./components.less";
import { Spin, Empty } from "antd";
import "antd/dist/antd.css";
import { LoadingOutlined } from "@ant-design/icons";

type WorkoutListProps = {
  workouts: IWorkout[];
  isLoading: boolean;
};

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, isLoading }) => {
  const workoutItems = workouts.map((workout: IWorkout) => {
    return <WorkoutItem workout={workout} key={workouts.indexOf(workout)}></WorkoutItem>;
  });

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className="workout_list">
      {isLoading ? (
        <Spin indicator={antIcon} />
      ) : !workouts.length ? (
        <Empty />
      ) : (
        <WorkoutList workouts={workouts} isLoading={isLoading}></WorkoutList>
      )}
      <div className="workout_scroll">{workoutItems}</div>
    </div>
  );
};

export default WorkoutList;
