import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./components.less";

const LoadingContent = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "#2A9D8F" }} spin />;

  return (
    <div className="center_div">
      <Spin indicator={antIcon} />
      <br />
      <p>Loading content...</p>
    </div>
  );
};

export default LoadingContent;
