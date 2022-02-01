import React from "react";
import { Modal } from "antd";
import { ISet } from "../interfaces";

const { confirm } = Modal;

type SaveWorkoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: Function;
  workout: ISet[];
};

const SaveWorkout: React.FC<SaveWorkoutProps> = ({ isModalVisible, setIsModalVisible, workout }) => {
  const handleOk = () => {
    setIsModalVisible(false);
    // save workout somewhere
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="popup">
      <Modal
        title="Do you want to save this workout?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}></Modal>
    </div>
  );
};

export default SaveWorkout;
