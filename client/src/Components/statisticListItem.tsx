import { iconSelector } from "./icons";
import { List, Avatar } from "antd";

type tStatisticListItem = {
  item: { title: string; count: number };
};
const StatisticListItem: React.FC<tStatisticListItem> = ({ item }) => {
  const Icon = iconSelector(item.title);
  return (
    <div className="stats-item">
      <List.Item>
        <Avatar style={{ color: "white", marginRight: "18px" }} icon={<Icon />} />
        <div className="stats-item-title">{item.title + ": "} </div>
        <div className="stats-item-count">{item.count}</div>
      </List.Item>
    </div>
  );
};
export default StatisticListItem;
