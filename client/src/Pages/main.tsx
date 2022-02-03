import React, { useEffect, useState } from "react";
import { Avatar, Layout, Menu } from "antd";
import "./pages.less";
import { Outlet } from "react-router-dom";
import { getUserWorkouts } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import WorkoutsContext from "../workoutContext";
import { UserOutlined } from "@ant-design/icons";

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
        <div className="nav-logo">LOGO</div>
        <div className="nav-content">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["0"]}>
            <Menu.Item key={0}>{`Home`}</Menu.Item>
          </Menu>
        </div>
        <div className="nav-user">
          <Avatar
            style={{
              backgroundColor: "#87d068"
            }}
            icon={<UserOutlined />}
          />
        </div>
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
