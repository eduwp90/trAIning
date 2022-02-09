import { EditOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, InputNumber, Form, message } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { calculateBMI } from "../helpers";
import { IDatesResponse } from "../interfaces";
import AuthService from "../Services/authService";
import { getUserProfile, updateUserProfile } from "../Services/dbService";

const Profile: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [profile, setProfile] = useState<IDatesResponse>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [mounted, setMounted] = useState<boolean>(true);
  const [bmi, setBmi] = useState<number | undefined>();

  function handleEdit() {
    if (profile) {
      setIsDisabled(false);
    }
    console.log(profile);
  }

  useEffect(() => {
    console.log("mounting");
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    console.log("using effect");
    let userProfile: IDatesResponse | undefined;
    const getUserInfo = async () => {
      if (user && mounted) {
        userProfile = await getUserProfile(user.uid);
      }
      console.log(userProfile);
      if (userProfile && mounted) {
        setProfile(userProfile);
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
        setProfile(newProfile);
        setIsDisabled(true);
        message.success("Saved!");
      }
    }
  };
  function onWeightChange(e: number) {
    setWeight(e);
  }
  function onHeightChange(e: number) {
    setHeight(e);
  }

  return (
    <div className="pages-Div">
      <div className="ant-layout-content">
        {profile && (
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
                      size={100}
                      shape={"square"}
                      src={
                        profile.photoURL !== "" && (
                          <Image src={profile.photoURL} style={{ width: 100 }} preview={false} />
                        )
                      }>
                      {!profile.photoURL && `${profile.name.charAt(0).toUpperCase()}`}
                    </Avatar>
                  }
                  title={profile.name + " " + profile.surname}
                  description={
                    <div>
                      <p>bmi: {bmi?.toFixed(1)}</p>
                      <p>activity-count: {profile.activities.length}</p>
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
