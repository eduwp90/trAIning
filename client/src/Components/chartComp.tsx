import React from "react";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { tActivities } from "../interfaces";

type tchartCompProps = {
  userActivities: tActivities[];
};

const ChartComp: React.FC<tchartCompProps> = ({ userActivities }) => {
  const dataByMonth = userActivities.map((set) => {
    const date = dayjs(set.date.toDate());
    return { ...set, date: date.format("MMMM") };
  });
  const config = {
    data: dataByMonth,
    isStack: true,
    xField: "date",
    yField: "count",
    seriesField: "type",
    interactions: [
      {
        type: "active-region",
        enable: false
      }
    ],
    columnBackground: {
      style: {
        fill: "rgba(0,0,0,0.1)"
      }
    }
  };

  return (
    <div className="chart">
      <Column {...config} />
    </div>
  );
};

export default ChartComp;
