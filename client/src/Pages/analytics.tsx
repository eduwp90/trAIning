import React from "react";
import CalendarComp from "../Components/calendarComp";
import dayjs, { Dayjs } from "dayjs";

const Analytics: React.FC = () => {
  const now = dayjs();
  const daysActive: Dayjs[] = [now];
  return (
    <div className="pages-Div">
      <CalendarComp daysActive={daysActive} />
    </div>
  );
};
export default Analytics;
