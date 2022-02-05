import React from "react";
// import CalendarComponent from "../Components/calendar";
import { DatePicker, TimePicker, Calendar } from "../Calendar";
// import format from "dayjs";
import dayjs, { Dayjs } from "dayjs";

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

type CalendarCompProps = {
  daysActive: Dayjs[];
};
const CalendarComp: React.FC<CalendarCompProps> = ({ daysActive }) => {
  function onChange(day: Dayjs) {
    // console.log(day);
  }

  function onFullRender(date: Dayjs) {
    if (daysActive.find((day) => day.isSame(date, "day"))) {
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

  return (
    <div className="calendar-Div">
      <h2>Days Active:</h2>
      <Calendar fullscreen={false} dateFullCellRender={onFullRender} defaultValue={dayjs()} onChange={onChange} />
      {/* <div>
        <DatePicker onChange={onChange} size="large" />
        <TimePicker defaultValue={dayjs("12:08:23", "HH:mm:ss")} size="large" />
      </div> */}
    </div>
  );
};

export default CalendarComp;
