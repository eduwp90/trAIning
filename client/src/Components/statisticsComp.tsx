import React from "react";
import { List } from "antd";
import { tRepCounts } from "../interfaces";

import StatisticListItem from "./statisticListItem";

type tStatisticsComp = {
  data: tRepCounts;
};

const StatisticsComp: React.FC<tStatisticsComp> = ({ data }) => {
  const arrayOfWorkoutType = [
    { title: "push-ups", count: data["push-ups"] },
    { title: "lunges", count: data.lunges },
    { title: "squats", count: data.squats },
    { title: "side-squats", count: data["side-squats"] },
    { title: "jumping-jacks", count: data["jumping-jacks"] }
  ];
  return (
    <div className="stats-list">
      <List
        itemLayout="horizontal"
        dataSource={arrayOfWorkoutType}
        renderItem={(item) => <StatisticListItem item={item} />}
        split={false}
        size={"small"}
      />
    </div>
  );
};
export default StatisticsComp;
