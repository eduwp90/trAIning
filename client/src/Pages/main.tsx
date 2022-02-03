import React from "react";
import { Avatar, Layout, Menu } from "antd";
import "./pages.less";
import { Outlet } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const Main: React.FC = () => {
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
      <Content>
        <div className="content">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default Main;
