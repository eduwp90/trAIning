import React from "react";
import { List, Avatar } from "antd";

type item = { title: string };

type StatisticsCompProps = {
  data: item[];
};

const StatisticsComp: React.FC<StatisticsCompProps> = ({ data }) => {
  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={<a href="https://ant.design">{item.title}</a>}
              // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </div>
  );
};
export default StatisticsComp;
