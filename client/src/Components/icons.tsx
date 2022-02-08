import Icon from "@ant-design/icons";
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
      icon = () => <JumpinjackSVG />;
      break;
  }
  const IconComponent = () => <Icon component={icon} />;
  return IconComponent;
};
