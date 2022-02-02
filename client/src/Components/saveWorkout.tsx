import React from "react";
import { Modal } from "antd";
import { ISet } from "../interfaces";
import { addWorkout } from "../Services/dbService";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthService from "../Services/authService";

const { confirm } = Modal;

type SaveWorkoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: Function;
  workout: ISet[];
};

const SaveWorkout: React.FC<SaveWorkoutProps> = ({ isModalVisible, setIsModalVisible, workout }) => {
  const [user] = useAuthState(AuthService.auth);

  const handleOk = () => {
    setIsModalVisible(false);
    // save workout somewhere
    addWorkout(user!.uid, workout, "test");
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
