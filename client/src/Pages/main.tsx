import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import "./pages.less";
import { Outlet } from "react-router-dom";
import { getUserWorkouts } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import WorkoutsContext from "../workoutContext";

const { Header, Content } = Layout;

const Main: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [userWorkouts, setUserWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserWorkouts(user!.uid);
      if (data) setUserWorkouts([...userWorkouts, ...data]);
    };

    user && fetchData();
  }, [user]);

  return (
    <Layout>
      <Header>
        <div className="logo">NAV BAR</div>
      </Header>
      <WorkoutsContext.Provider value={{ userWorkouts, setUserWorkouts }}>
        <Content>
          <div className="content">
            <Outlet />
          </div>
        </Content>
      </WorkoutsContext.Provider>
    </Layout>
  );
};

export default Main;
