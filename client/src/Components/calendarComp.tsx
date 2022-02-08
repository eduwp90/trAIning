import React from "react";
import { /*DatePicker, TimePicker,*/ Calendar } from "../Calendar";
import dayjs, { Dayjs } from "dayjs";
import StatisticListItem from "./statisticListItem";
import { List } from "antd";

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const unique = (value: Dayjs, index: number, self: Dayjs[]) => {
  if (index < self.length - 1) {
    return !value.isSame(self[index + 1], "day");
  } else {
    return true;
  }
};

type CalendarCompProps = {
  daysActive: Dayjs[];
};
const CalendarComp: React.FC<CalendarCompProps> = ({ daysActive }) => {
  console.log(daysActive);
  const uniqueDays = daysActive.filter(unique);
  console.log(uniqueDays);
  function onChange(day: Dayjs) {}

  function onFullRender(date: Dayjs) {
    if (uniqueDays.find((day) => day.isSame(date, "day"))) {
      return (
        <div
          style={{
            background: "#2a9d8f",
            color: "white",
            borderRadius: "15px",
            margin: "0 8px"
          }}>
          {date.date()}
        </div>
      );
    }
    return <div>{date.date()}</div>;
  }

  const item = { title: "Total Days Active", count: uniqueDays.length };
  return (
    <div className="stats-list">
      <List itemLayout="horizontal" split={false} size={"small"}>
        <StatisticListItem item={item} />
      </List>
      <div className="calendar-Div">
        <Calendar fullscreen={false} dateFullCellRender={onFullRender} defaultValue={dayjs()} onChange={onChange} />
        {/* <div>
          <DatePicker onChange={onChange} size="large" />
          <TimePicker defaultValue={dayjs("12:08:23", "HH:mm:ss")} size="large" />
        </div> */}
      </div>
    </div>
  );
};

export default CalendarComp;
