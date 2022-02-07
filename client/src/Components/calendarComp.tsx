import React from "react";
import { /*DatePicker, TimePicker,*/ Calendar } from "../Calendar";
import dayjs, { Dayjs } from "dayjs";

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const unique = (value: Dayjs, index: number, self: Dayjs[]) => {
  if (index >= 1) {
    return !value.isSame(self[index + 1], "day");
  } else {
    return true;
  }
};

type CalendarCompProps = {
  daysActive: Dayjs[];
};
const CalendarComp: React.FC<CalendarCompProps> = ({ daysActive }) => {
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

  return (
    <div className="calendar-Div">
      <h2 className="calendar-title">
        Total Days Active:<span className="calendar-count">{uniqueDays.length}</span>
      </h2>
      <Calendar fullscreen={false} dateFullCellRender={onFullRender} defaultValue={dayjs()} onChange={onChange} />
      {/* <div>
        <DatePicker onChange={onChange} size="large" />
        <TimePicker defaultValue={dayjs("12:08:23", "HH:mm:ss")} size="large" />
      </div> */}
    </div>
  );
};

export default CalendarComp;
