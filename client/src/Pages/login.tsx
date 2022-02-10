import { Form, Input, Button, Alert, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../Services/authService";
import { useEffect, useState } from "react";
import { UserInfo } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./pages.less";
import { IGoogleUserResponse } from "../interfaces";

const Login: React.FC = () => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(false);

    const res: UserInfo | string = await AuthService.loginUser(values.email, values.password);

    if (typeof res === "string") {
      setError(true);
      setErrorMsg(res);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  const googleBtn = async () => {
    setLoading(true);
    setError(false);
    const res: IGoogleUserResponse | undefined = await AuthService.signInWithGoogle();
    setLoading(false);

    if (res) {
      if (res.isNewUser) {
        //redirect to complete register
        navigate("/register", {
          state: {
            googleUserId: res.user.uid,
            photoURL: res.user.photoURL
          }
        });
      } else {
        //log in with no further action
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (user) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="background-div">
      <div className="login-container">
        <div className="login-logo">
          <div className="logo"></div>
        </div>
        {/* <h1>Log in</h1> */}
        <Button className="google-signin-btn" type="default" icon={<GoogleOutlined />} onClick={googleBtn}>
          Continue with Google
        </Button>
        <Divider plain>or</Divider>
        {error && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: "1rem" }} />}
        <Form
          name="normal_login"
          layout="vertical"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
              Log in
            </Button>
          </Form.Item>
          <div className="register-link">
            Not a member? <Link to="/register"> Create account!</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
