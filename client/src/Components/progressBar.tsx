import "./components.less";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progressBar-Div">
      <div className="progressBar_complete" style={{ width: progress + "%" }}></div>
      {/* <div className="progressBar_incomplete"></div> */}
    </div>
  );
};

export default ProgressBar;
