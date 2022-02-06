import React, { useEffect, useState } from "react";
import "antd/dist/antd.less";
import { Link, useLocation } from "react-router-dom";
import { Form, Input, Button, Alert, Space, InputNumber } from "antd";
import AuthService from "../Services/authService";
import { useNavigate } from "react-router";
import { UserInfo } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { calculateBMI } from "../helpers";
import { addNewProfile } from "../Services/dbService";

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);
  const { state }: any = useLocation();

  console.log("router state ", state);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(false);
    console.log(values);

    let userId: string;
    let photoURL: string;

    const bmi: number = calculateBMI(values.height, values.weight);

    if (state) {
      //data from google signin
      userId = state.googleUserId;
      photoURL = state.photoURL;
    } else {
      // signup normal user
      const res: UserInfo | string = await AuthService.signupUser(values.email, values.password);

      if (typeof res === "string") {
        setError(true);
        setErrorMsg(res);
        setLoading(false);
        return;
      } else {
        userId = res.uid;
        photoURL = "";
      }
    }

    addNewProfile(userId, values.name, values.surname, photoURL, values.height, values.weight, bmi);
    navigate("/");
  };

  useEffect(() => {
    if (user && !state) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="background-div">
      <div className="register-container">
        <h1>{state ? "Complete your registration" : "Sign Up"}</h1>
        {error && <Alert message={errorMsg} type="error" showIcon style={{ margin: "1rem 0" }} />}
        <Form
          layout="vertical"
          form={form}
          name="register"
          className="register-form"
          onFinish={onFinish}
          scrollToFirstError>
          {!state && (
            <>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]}>
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!"
                  }
                ]}
                hasFeedback>
                <Input.Password placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!"
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error("The two passwords that you entered do not match!"));
                    }
                  })
                ]}>
                <Input.Password placeholder="Repeat password" />
              </Form.Item>
            </>
          )}

          <Space style={{ display: "flex" }} align="baseline">
            <Form.Item name="name" rules={[{ required: true, message: "Missing first name" }]}>
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item name="surname" rules={[{ required: true, message: "Missing last name" }]}>
              <Input placeholder="Last Name" />
            </Form.Item>
          </Space>

          <Space style={{ display: "flex" }} align="baseline">
            <Form.Item name="height" rules={[{ required: true, message: "Missing height" }]}>
              <InputNumber min={100} max={250} placeholder="Height" addonAfter="cm" type="number" />
            </Form.Item>
            <Form.Item name="weight" rules={[{ required: true, message: "Missing weight" }]}>
              <InputNumber min={20} max={200} placeholder="Weight" addonAfter="Kg" type="number" />
            </Form.Item>
          </Space>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="register-form-button">
              Register
            </Button>
          </Form.Item>
        </Form>
        {!state && (
          <div className="register-link">
            Or <Link to="/login">login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
