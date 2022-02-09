import React, { useContext } from "react";
import { /*DatePicker, TimePicker,*/ Calendar } from "../Calendar";
import dayjs, { Dayjs } from "dayjs";
import StatisticListItem from "./statisticListItem";
import { List } from "antd";
import { IWorkoutContext } from "../interfaces";
import { WorkoutContext } from "../Context/workoutProvider";

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const unique = (value: Dayjs, index: number, self: Dayjs[]) => {
  let isUnique: boolean = true;
  if (self[index + 1]) {
    isUnique = !value.isSame(self[index + 1], "day");
  }
  return isUnique;
};

type CalendarCompProps = {
  daysActive: Dayjs[];
};
const CalendarComp: React.FC<CalendarCompProps> = ({ daysActive }) => {
  const { userProfile } = useContext<IWorkoutContext>(WorkoutContext);
  // userProfile?.total_time
  // userProfile?.total_calories
  const uniqueDays = daysActive.filter(unique);
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

  const activeDays = { title: "Total Days Active", count: uniqueDays.length };
  let activeTime;
  let caloriesBurned;
  if (userProfile) {
    let minutes = userProfile?.total_time / 60;
    activeTime = { title: "Total Minutes Active", count: minutes };
    caloriesBurned = { title: "Total Calories Burned", count: userProfile.total_calories };
  }

  return (
    <div className="stats-list">
      <List itemLayout="horizontal" split={false} size={"small"}>
        <StatisticListItem item={activeDays} />
        {activeTime && <StatisticListItem item={activeTime} />}
        {caloriesBurned && <StatisticListItem item={caloriesBurned} />}
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
