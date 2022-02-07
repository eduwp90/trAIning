import React, { useEffect, useState } from "react";
import CalendarComp from "../Components/calendarComp";
import { Dayjs } from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { getUserActiveDates } from "../Services/dbService";
import StatisticsComp from "../Components/statisticsComp";

const Analytics: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [daysActive, setDaysActive] = useState<Dayjs[]>([]);

  useEffect(() => {
    let mounted = true;
    const populateActiveDatesArray = async () => {
      let activeDates;
      if (user && mounted) {
        activeDates = await getUserActiveDates(user!.uid);
      }
      if (activeDates && mounted) {
        setDaysActive(activeDates);
      }
    };
    populateActiveDatesArray();
    return () => {
      mounted = false;
    };
  }, [user]);
  return (
    <div className="pages-Div">
      <div className="analytic-Div">
        <div className="analytic-calendar-Div">
          <CalendarComp daysActive={daysActive} />
        </div>
        <div className="analytic-data-Div">
          <StatisticsComp
            data={[{ title: "situps" }, { title: "squats" }, { title: "lunges" }, { title: "pushups" }]}
          />
        </div>
      </div>
    </div>
  );
};
export default Analytics;
