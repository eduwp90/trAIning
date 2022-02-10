import React from "react";
import { List } from "antd";
import StatisticListItem from "./statisticListItem";
import { tActivities } from "../interfaces";

type tactivities = {
  title: string;
  count: number;
};
type tchartCompProps = {
  userActivities: tActivities[];
};

const StatisticsComp: React.FC<tchartCompProps> = ({ userActivities }) => {
  const uniqueList: string[] = [];
  let activityList: tactivities[] = [];
  for (let i = 0, length = userActivities.length; i < length; i++) {
    if (!uniqueList.includes(userActivities[i].type)) {
      uniqueList.push(userActivities[i].type);
      activityList.push({
        title: userActivities[i].type,
        count: userActivities[i].count
      });
    } else {
      const index = uniqueList.indexOf(userActivities[i].type);
      activityList[index] = {
        title: userActivities[i].type,
        count: userActivities[i].count + activityList[index].count
      };
    }
  }
  return (
    <div className="stats-list">
      <List
        itemLayout="horizontal"
        dataSource={activityList}
        renderItem={(item) => <StatisticListItem item={item} />}
        split={false}
        size={"small"}
      />
    </div>
  );
};
export default StatisticsComp;
