import React, { useContext } from "react";
import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { WorkoutContext } from "../Context/workoutProvider";
import { IWorkoutContext } from "../interfaces";

type SaveWorkoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: Function;
};

const SaveWorkout: React.FC<SaveWorkoutProps> = ({ isModalVisible, setIsModalVisible }) => {
const {existingWorkout, clearWorkout, clearExistingWorkout} = useContext<IWorkoutContext>(WorkoutContext)
  const navigate = useNavigate()

  const handleOk = () => {
    navigate('/summary')
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const returnHome = () => {
    clearWorkout()
    clearExistingWorkout()
    navigate('/')
  }


  return (
    <div className="popup">
      {!existingWorkout? <Modal
        title="Do you want to save this workout?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Save
          </Button>,
          <Button
            onClick={returnHome}
          >
            return to home
          </Button>
        ]} />
        : <Modal
          title={`${existingWorkout.name} complete!`}
          visible={isModalVisible}
          closable={false}
        footer={[
          <Button
            onClick={returnHome}
          >
            return to home
          </Button>
        ]} />}
    </div>
  );
};

export default SaveWorkout;


