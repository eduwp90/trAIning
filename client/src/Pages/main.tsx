import React from "react";
import { Avatar, Layout, Menu, Image } from "antd";
import "./pages.less";
import { Link, Outlet } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
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
        <div className="nav-logo">LOGO</div>
        <div className="nav-content">
          <Menu mode="horizontal" defaultSelectedKeys={["0"]}>
            <Menu.Item key={0}>
              <Link to="/">Home</Link>
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
