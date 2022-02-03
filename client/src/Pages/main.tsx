import React from "react";
import { Layout } from "antd";
import "./pages.less";
import { Outlet } from "react-router-dom";

const { Header, Content } = Layout;

const Main: React.FC = () => {

  return (
    <Layout>
      <Header>
        <div className="logo">NAV BAR</div>
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
