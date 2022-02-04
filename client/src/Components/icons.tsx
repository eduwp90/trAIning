import Icon from "@ant-design/icons";
import JumpinjackSVG from "../Assets/jumpinjackSVG";
import LungesSVG from "../Assets/lungesSVG";
import PushupSVG from "../Assets/pushupSVG";
import SidesquatSVG from "../Assets/sidesquatSVG";
import SquatSVG from "../Assets/squatSVG";

export const iconSelector = (exerciseType: string): (() => JSX.Element) => {
  let icon: () => JSX.Element;
  if (exerciseType === "push-ups") {
    icon = () => (
     <PushupSVG/>
    );
  } else if (exerciseType === "squats") {
    icon = () => (
      <SquatSVG/>
    );
  } else if (exerciseType === "lunges") {
    icon = () => (
      <LungesSVG/>
    );
  } else if (exerciseType === "jumping-jacks") {
    icon = () => (
      <JumpinjackSVG/>
    );
  } else if (exerciseType === "side-squats") {
    icon = () => (
      <SidesquatSVG/>
    );
  }
  const IconComponent = () => <Icon component={icon} />;
  return IconComponent;
};
