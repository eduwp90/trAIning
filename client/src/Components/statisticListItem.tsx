import { iconColorSelector, iconSelector } from "./icons";
import { List, Avatar } from "antd";

type tStatisticListItemProps = {
  item: { title: string; count: number };
};
const StatisticListItem: React.FC<tStatisticListItemProps> = ({ item }) => {
  const Icon = iconSelector(item.title);
  const bgcolor: string = iconColorSelector(item.title);
  return (
    <div className="stats-item">
      <List.Item>
        <Avatar style={{ color: "white", marginRight: "18px", backgroundColor: bgcolor }} icon={<Icon />} />
        <div className="stats-item-title">{item.title + ": "} </div>
        <div className="stats-item-count">{item.count}</div>
      </List.Item>
    </div>
  );
};
export default StatisticListItem;
