import React, { useEffect, useState } from "react";
import CalendarComp from "../Components/calendarComp";
import { Dayjs } from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { getUserActiveDates, getUserActivities } from "../Services/dbService";
import StatisticsComp from "../Components/statisticsComp";
import ChartComp from "../Components/chartComp";
import { tActivities } from "../interfaces";
import { Empty } from "antd";
import LoadingContent from "../Components/loadingContent";

const Analytics: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [daysActive, setDaysActive] = useState<Dayjs[]>([]);
  const [userActivities, setUserActivities] = useState<tActivities[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const updateState = async (): Promise<void> => {
      setIsLoading(true);
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
      setIsLoading(false);
    };
    updateState();
    return () => {
      mounted = false;
    };
  }, [user]);
  return (
    <div className="pages-Div">
      {isLoading ? (
        <div className="analytics-empty">
          <LoadingContent />
        </div>
      ) : userActivities.length === 0 ? (
        <div className="ant-layout-content analytics-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"You don't have any records yet"} />
        </div>
      ) : (
        <div className="analytic-Div">
          <div className="analytic-data-Div">
            <StatisticsComp userActivities={userActivities} />
            <div>
              <ChartComp userActivities={userActivities} />
            </div>
          </div>
          <div className="analytic-calendar-Div">
            <CalendarComp daysActive={daysActive} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Analytics;
