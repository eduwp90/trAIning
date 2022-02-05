import React from "react";
// import CalendarComponent from "../Components/calendar";
import { DatePicker, TimePicker, Calendar } from "../Calendar";
// import format from "dayjs";
import { Dayjs } from "dayjs";

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

type CalendarCompProps = {
  daysActive: Dayjs[];
};
const CalendarComp: React.FC<CalendarCompProps> = ({ daysActive }) => {
  // function onChange(date: any, dateString: any) {
  //   console.log(date, dateString);
  // }
  function onPanelChange(value: any, mode: any) {
    console.log(value, mode);
  }

  function onFullRender(date: Dayjs) {
    console.log(date);
    if (daysActive[0] === date) {
      console.log(date);
      console.log(daysActive);
    }
    return <div>{date.date()}</div>;
  }

  return (
    <div className="pages-Div">
      <div>
        {/* <DatePicker onChange={onChange} /> */}
        <br />
        {/* <MonthPicker onChange={onChange} placeholder="Select month" /> */}
        <br />
        {/* <RangePicker onChange={onChange} /> */}
        <br />
        {/* <WeekPicker onChange={onChange} placeholder="Select week" /> */}
      </div>
      <Calendar onPanelChange={onPanelChange} fullscreen={false} dateFullCellRender={onFullRender} />
      {/* <div>
        <TimePicker defaultValue={format("12:08:23", "HH:mm:ss")} size="large" />
        <TimePicker defaultValue={format("12:08:23", "HH:mm:ss")} />
        <TimePicker defaultValue={format("12:08:23", "HH:mm:ss")} size="small" />
      </div> */}
    </div>
  );
};

export default CalendarComp;
