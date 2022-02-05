import React, { useEffect, useState } from "react";
import CalendarComp from "../Components/calendarComp";
import { Dayjs } from "dayjs";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { getUserActiveDates } from "../Services/dbService";

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
      <CalendarComp daysActive={daysActive} />
    </div>
  );
};
export default Analytics;
