import "./components.less";
import { Progress } from "antd";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <Progress
      percent={progress}
      status="active"
      showInfo={false}
      strokeColor="#2a9d8f"
      trailColor="#264653"
      strokeWidth={12}
    />
  );
};

export default ProgressBar;
