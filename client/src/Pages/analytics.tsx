import React from "react";
import CalendarComp from "../Components/calendarComp";
import dayjs, { Dayjs } from "dayjs";

const Analytics: React.FC = () => {
  const now = dayjs();
  const tomorrow = dayjs().add(1, "day");
  const nextWeek = dayjs().add(7, "day");
  const daysActive: Dayjs[] = [now, tomorrow, nextWeek];
  return (
    <div className="pages-Div">
      <CalendarComp daysActive={daysActive} />
    </div>
  );
};
export default Analytics;
