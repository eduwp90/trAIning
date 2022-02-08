import { EditOutlined, EllipsisOutlined, FileDoneOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, InputNumber, Form, Button } from "antd";
import Meta from "antd/lib/card/Meta";
// import Form from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import CommentComp from "../Components/comments";
import { IDatesResponse } from "../interfaces";
import AuthService from "../Services/authService";
import { getUserProfile } from "../Services/dbService";

// dates: Timestamp[];
// friendsId: string[];
// photoURL: string;
// bmi: number;
// height: number;
// weight: number;
// name: string;
// surname: string;
// activities: tActivities[];

const Profile: React.FC = () => {
  // const [user] = useAuthState(AuthService.auth);
  const [profile, setProfile] = useState<IDatesResponse>({
    dates: [],
    friendsId: [""],
    photoURL: "",
    bmi: 2,
    height: 56,
    weight: 56,
    name: "Natasha",
    surname: "Van Dam",
    activities: []
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [weight, setWeight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  function handleEdit() {
    setIsDisabled(false);
  }

  // useEffect(() => {
  //   let mounted = true;
  //   let userProfile: IDatesResponse | undefined;
  //   const getUserInfo = async () => {
  //     if (user && mounted) {
  //       userProfile = await getUserProfile(user.uid);
  //     }
  //     if (userProfile && mounted) {
  //       setProfile(userProfile);
  //       setWeight(userProfile.weight);
  //       setHeight(userProfile.height);
  //     }
  //   };
  //   getUserInfo();
  //   return () => {
  //     mounted = false;
  //   };
  // });
  // setProfile();

  const onFinish = (e: React.FormEvent<HTMLInputElement>): void => {
    console.log(Object.values(e));
    setWeight(Object.values(e)[0]);
    setHeight(Object.values(e)[1]);
    setProfile((prev) => {
      return { ...prev, weight: weight, height: height };
    });
  };

  return (
    <div className="ant-layout-content">
      {profile && (
        <div>
          <div className="profile-card">
            <Card
              style={{ width: 300 }}
              actions={[
                <div>
                  <span>edit </span>
                  <EditOutlined key="edit" onClick={handleEdit} />
                </div>,
                <Button htmlType="submit">
                  <span>submit </span>
                  <FileDoneOutlined key="sumbit" />
                </Button>
              ]}>
              <Meta
                avatar={
                  <Avatar
                    src={
                      profile.photoURL !== "" && <Image src={profile.photoURL} style={{ width: 32 }} preview={false} />
                    }>
                    {!profile.photoURL && `${profile.name.charAt(0).toUpperCase()}`}
                  </Avatar>
                }
                title={profile.name + " " + profile.surname}
                description={"bmi: " + profile.bmi}
              />
              <Form className="BMI-form" onFinish={onFinish}>
                <Form.Item
                  name={"weight"}
                  label="weight"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  initialValue={weight}>
                  <InputNumber size="large" placeholder="Weight" style={{ width: 120 }} disabled={isDisabled} />
                </Form.Item>
                <Form.Item
                  name={"height"}
                  label="height"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  initialValue={height}>
                  <InputNumber size="large" placeholder="Height" style={{ width: 120 }} disabled={isDisabled} />
                </Form.Item>
              </Form>
            </Card>
          </div>
          {/* <CommentComp /> */}
        </div>
      )}
    </div>
  );
};

export default Profile;
