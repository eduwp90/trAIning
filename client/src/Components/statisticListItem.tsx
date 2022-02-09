import { iconSelector } from "./icons";
import { List, Avatar } from "antd";

type tStatisticListItem = {
  item: { title: string; count: number };
};
const StatisticListItem: React.FC<tStatisticListItem> = ({ item }) => {
  const Icon = iconSelector(item.title);
  const bgcolor: string = colorSelector(item.title);
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

function colorSelector(item: string) {
  let color: string = "black";
  switch (item) {
    case "push-ups":
      color = "#264653";
      break;
    case "squats":
      color = "#264653";
      break;
    case "lunges":
      color = "#264653";
      break;
    case "jumping-jacks":
      color = "#264653";
      break;
    case "side-squats":
      color = "#264653";
      break;
    case "Total Days Active":
      color = "#2A9D8F";
      break;
    case "Total Minutes Active":
      color = "#E9C46A";
      break;
    case "Total Calories Burned":
      color = "#E76F51";
      break;
  }
  return color;
}
