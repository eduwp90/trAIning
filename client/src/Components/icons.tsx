import Icon, { ClockCircleOutlined, FireOutlined, ScheduleOutlined } from "@ant-design/icons";
import JumpinjackSVG from "../Assets/jumpinjackSVG";
import LungesSVG from "../Assets/lungesSVG";
import PushupSVG from "../Assets/pushupSVG";
import SidesquatSVG from "../Assets/sidesquatSVG";
import SquatSVG from "../Assets/squatSVG";

export const iconSelector = (exerciseType: string): (() => JSX.Element) => {
  let icon: () => JSX.Element;
  switch (exerciseType) {
    case "push-ups":
      icon = () => <PushupSVG />;
      break;
    case "squats":
      icon = () => <SquatSVG />;
      break;
    case "lunges":
      icon = () => <LungesSVG />;
      break;
    case "jumping-jacks":
      icon = () => <JumpinjackSVG />;
      break;
    case "side-squats":
      icon = () => <SidesquatSVG />;
      break;
    case "Total Days Active":
      icon = () => <ScheduleOutlined />;
      break;
    case "Total Minutes Active":
      icon = () => <ClockCircleOutlined />;
      break;
    case "Total Calories Burned":
      icon = () => <FireOutlined />;
      break;
  }
  const IconComponent = () => <Icon component={icon} />;
  return IconComponent;
};

export function iconColorSelector(item: string) {
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
