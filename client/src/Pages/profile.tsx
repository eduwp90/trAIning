import { EditOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, InputNumber, Form, message } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { WorkoutContext } from "../Context/workoutProvider";
import { calculateBMI } from "../helpers";
import { IWorkoutContext } from "../interfaces";
import AuthService from "../Services/authService";
import { updateUserProfile } from "../Services/dbService";

const Profile: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const { userProfile, setUserProfile } = useContext<IWorkoutContext>(WorkoutContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [mounted, setMounted] = useState<boolean>(true);
  const [bmi, setBmi] = useState<number | undefined>();

  function handleEdit(): void {
    if (userProfile) {
      setIsDisabled(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    const getUserInfo = async (): Promise<void> => {
      if (userProfile && mounted) {
        setWeight(userProfile.weight);
        setHeight(userProfile.height);
        setBmi(userProfile.bmi);
      }
    };
    getUserInfo();
  }, [user]);

  const onFinish = async (): Promise<void> => {
    if (user && mounted && height && weight) {
      const newBmi: number = calculateBMI(height, weight);
      setBmi(newBmi);
      if (weight && height) {
        const newProfile = await updateUserProfile(user.uid, height, weight, newBmi);
        setUserProfile(newProfile);
        setIsDisabled(true);
        message.success("Saved!");
      }
    }
  };
  function onWeightChange(e: number): void {
    setWeight(e);
  }
  function onHeightChange(e: number): void {
    setHeight(e);
  }

  return (
    <div className="pages-Div">
      <div className="ant-layout-content">
        {userProfile && (
          <div>
            <div className="profile-card">
              <Card
                style={{ width: 300 }}
                actions={[
                  <div onClick={handleEdit}>
                    <span>edit </span>
                    <EditOutlined key="edit" />
                  </div>,
                  <div onClick={onFinish}>
                    <span>submit </span>
                    <FileDoneOutlined key="sumbit" />
                  </div>
                ]}>
                <Meta
                  avatar={
                    <Avatar
                      size={80}
                      src={
                        userProfile.photoURL !== "" && (
                          <Image src={userProfile.photoURL} style={{ width: 80 }} preview={false} />
                        )
                      }>
                      {!userProfile.photoURL && `${userProfile.name.charAt(0).toUpperCase()}`}
                    </Avatar>
                  }
                  title={userProfile.name + " " + userProfile.surname}
                  description={
                    <div>
                      <p>bmi: {bmi?.toFixed(1)}</p>
                    </div>
                  }
                />
                <Form className="BMI-form">
                  <Form.Item label="weight" initialValue={weight}>
                    <InputNumber
                      size="large"
                      placeholder={weight?.toString() || "Weight"}
                      style={{ width: 120 }}
                      disabled={isDisabled}
                      onChange={onWeightChange}
                    />
                    <span> kg</span>
                  </Form.Item>
                  <Form.Item label="height" initialValue={height}>
                    <InputNumber
                      size="large"
                      placeholder={height?.toString() || "Height"}
                      style={{ width: 120 }}
                      disabled={isDisabled}
                      onChange={onHeightChange}
                    />
                    <span> cm</span>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
