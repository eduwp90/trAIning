import { ClockCircleOutlined, FireOutlined } from "@ant-design/icons";
import { Col, Row, Statistic } from "antd";
import React, { useEffect, useState, useContext, useRef } from "react";
import "./components.less";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { WorkoutContext } from "../Context/workoutProvider";
import { calculateRepCalories } from "../helpers";
dayjs.extend(relativeTime);

interface WebcamLiveStatsProps {
  isFinished: boolean;
  exer: string;
  repCount: number;
}

const WebcamLiveStats: React.FC<WebcamLiveStatsProps> = ({ isFinished, exer, repCount }) => {
  const [time, setTime] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<any>(null);
  const { userProfile } = useContext(WorkoutContext);
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const firstRun = useRef<boolean>();

  function startTimeCounter() {
    isMounted && setIntervalId(setInterval(updateEverySecond, 1000));
  }

  function updateEverySecond() {
    if (isMounted && !isFinished) setTime((prev) => prev + 1);
  }

  function incrementCaloriesCount() {
    const repCalories = calculateRepCalories(userProfile!.weight, exer, 1);
    setCalories((prev) => Math.round((prev + repCalories) * 10) / 10);
  }

  useEffect(() => {
    setIsMounted(true);

    firstRun.current = true;
    clearInterval(intervalId);

    return () => {
      clearInterval(intervalId);
      setIsMounted(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isFinished && clearInterval(intervalId);
  }, [isFinished, intervalId]);

  useEffect(() => {
    if (isFinished) return;
    if (firstRun.current && repCount === 0) {
    } else if (firstRun.current && repCount != 0) {
      incrementCaloriesCount();
      startTimeCounter();
      firstRun.current = false;
    } else {
      incrementCaloriesCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repCount]);

  return (
    <div className="live-stats-container">
      <Row gutter={65}>
        <Col span={40}>
          <Statistic
            title="Time elapsed"
            value={dayjs().hour(0).minute(0).second(time).format("mm:ss")}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
        <Col span={40}>
          <Statistic title="Calories burned" value={calories} prefix={<FireOutlined />} />
        </Col>
      </Row>
    </div>
  );
};

export default WebcamLiveStats;
