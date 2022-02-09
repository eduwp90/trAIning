import React, { useEffect, useState } from "react";
import CalendarComp from "../Components/calendarComp";
import { Dayjs } from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { getUserActiveDates, getUserActivities } from "../Services/dbService";
import StatisticsComp from "../Components/statisticsComp";
import ChartComp from "../Components/chartComp";
import { tActivities } from "../interfaces";

const Analytics: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [daysActive, setDaysActive] = useState<Dayjs[]>([]);
  const [userActivities, setUserActivities] = useState<tActivities[]>([]);

  useEffect(() => {
    let mounted = true;
    const updateState = async () => {
      let activeDates;
      let activities;
      if (user && mounted) {
        activeDates = await getUserActiveDates(user!.uid);
        activities = await getUserActivities(user!.uid);
      }
      if (activeDates && activities && mounted) {
        setDaysActive(activeDates);
        setUserActivities(activities);
      }
    };
    updateState();
    return () => {
      mounted = false;
    };
  }, [user]);
  return (
    <div className="pages-Div">
      <div className="analytic-Div">
        <div className="analytic-data-Div">
          <StatisticsComp userActivities={userActivities} />
          {userActivities.length ? (
            <div>
              <ChartComp userActivities={userActivities} />
              <div className="analytic-calendar-Div">
                <CalendarComp daysActive={daysActive} />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
export default Analytics;
