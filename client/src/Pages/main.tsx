import React, { useContext, useEffect } from "react";
import { Avatar, Layout, Menu, Image } from "antd";
import "./pages.less";
import { Link, NavLink, Outlet, useLocation, useResolvedPath } from "react-router-dom";
import { BarChartOutlined, HomeOutlined, LogoutOutlined, SmileOutlined, TeamOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";
import { getUserProfile } from "../Services/dbService";
import { getFriendsProfilesByIds } from "../Services/friendsService";
import { WorkoutContext } from "../Context/workoutProvider";

const { Header, Content } = Layout;

const Main: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const { userProfile, storeUserProfile, storeFriendsProfiles } = useContext(WorkoutContext);
  const location = useLocation();

  const logout = (): void => {
    AuthService.logoutUser();
  };

  const setSelectedMenuItem = (pathname: string) => {
    switch (pathname) {
      case "/":
        return ["home"];
      case "/analytics":
        return ["analytics"];
      case "/friends":
        return ["friends"];

      default:
        return [];
    }
  };

  useEffect(() => {
    async function fetchProfile(id: string) {
      const res = await getUserProfile(id);

      if (res) {
        storeUserProfile(res);
        const profiles = await getFriendsProfilesByIds(res.friendsId);
        profiles && storeFriendsProfiles(profiles);
      }
    }

    if (user && !userProfile) {
      fetchProfile(user.uid);
    }
  }, [user]);

  return (
    <Layout className="layout">
      <Header className="navbar">
        <div className="nav_container">
          <div className="nav-logo">
            <img className="nav-logo-image" alt="training.ai" />
          </div>

          <Menu className="nav-content" mode="horizontal" defaultSelectedKeys={setSelectedMenuItem(location.pathname)}>
            <Menu.Item key="home">
              <NavLink to="/">
                <HomeOutlined />
                <span className="nav-content-item">Home</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="analytics">
              <NavLink to="analytics">
                <BarChartOutlined />
                <span className="nav-content-item">Analytics</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="friends">
              <NavLink to="friends">
                <TeamOutlined />
                <span className="nav-content-item">Friends</span>
              </NavLink>
            </Menu.Item>
          </Menu>

          <div className="nav-user">
            {user && (
              <Menu mode="horizontal" className="user-menu">
                <Menu.SubMenu
                  key={"submenu"}
                  title={
                    <Avatar
                      src={
                        user?.photoURL && (
                          <Image
                            src={user.photoURL}
                            style={{
                              width: 32
                            }}
                            preview={false}
                          />
                        )
                      }>
                      {!user.photoURL && `${user.email?.charAt(0).toUpperCase()}`}
                    </Avatar>
                  }>
                  <Menu.Item key="logout" onClick={logout}>
                    <LogoutOutlined /> Logout
                  </Menu.Item>
                  <Menu.Item key="profile">
                    <Link to="profile">
                      <SmileOutlined />
                      <span className="nav-content-item">Profile</span>
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu>
            )}
          </div>
        </div>
      </Header>
      <Content>
        <div className="content">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default Main;
