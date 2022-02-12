import { Modal } from "antd";
import React from "react";
import SendChallenge from "./sendChallenge";

type SendChallengeModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: Function;
};

const SendChallengeModal: React.FC<SendChallengeModalProps> = ({ isModalVisible, setIsModalVisible }) => {
  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal title="Send a challenge to a friend" footer={null} visible={isModalVisible} onCancel={handleCancel}>
        <SendChallenge onCancel={handleCancel}></SendChallenge>
      </Modal>
    </>
  );
};

export default SendChallengeModal;
