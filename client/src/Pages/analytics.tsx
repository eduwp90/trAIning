import React, { useEffect, useState } from "react";
import CalendarComp from "../Components/calendarComp";
import { Dayjs } from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { getUserActiveDates, getUserRepData } from "../Services/dbService";
import StatisticsComp from "../Components/statisticsComp";
import { tRepCounts } from "../interfaces";

const Analytics: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [daysActive, setDaysActive] = useState<Dayjs[]>([]);
  const [userReps, setUserReps] = useState<tRepCounts>();

  useEffect(() => {
    let mounted = true;
    const populateActiveDatesArray = async () => {
      let activeDates;
      let userRepData;
      if (user && mounted) {
        activeDates = await getUserActiveDates(user!.uid);
        userRepData = await getUserRepData(user!.uid);
      }
      if (activeDates && mounted && userRepData) {
        setDaysActive(activeDates);
        setUserReps(userRepData);
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
        <div className="analytic-data-Div">{userReps && <StatisticsComp data={userReps} />}</div>
      </div>
    </div>
  );
};
export default Analytics;
