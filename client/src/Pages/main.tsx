import React, { useState } from "react";
import { Avatar, Layout, Menu, Image } from "antd";
import "./pages.less";
import { Link, Outlet } from "react-router-dom";
import { BarChartOutlined, HomeOutlined, LogoutOutlined, TeamOutlined } from "@ant-design/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";

const { Header, Content } = Layout;

const Main: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);

  const logout = (): void => {
    AuthService.logoutUser();
  };

  console.log("user ", user);
  return (
    <Layout className="layout">
      <Header className="navbar">
        <div className="nav_container">
          <div className="nav-logo"></div>
          <div className="nav-content">
            <Menu mode="horizontal" defaultSelectedKeys={[]} style={{ flexGrow: "1" }}>
              <Menu.Item key={0}>
                <Link to="/">
                  <HomeOutlined />
                  <span className="nav-content-item">Home</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="analytics">
                <Link to="analytics">
                  <BarChartOutlined />
                  <span className="nav-content-item">Analytics</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="friends">
                <Link to="friends">
                  <TeamOutlined />
                  <span className="nav-content-item">Friends</span>
                </Link>
              </Menu.Item>
            </Menu>
          </div>
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
