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
    },
    colorField: "type",
    color: ["#2A9D8F", "#F4A261", "#264653", "#E76F51", "#E9C46A"]
  };

  return (
    <div className="chart">
      <Column {...config} />
    </div>
  );
};

export default ChartComp;
