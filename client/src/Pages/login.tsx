import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../Services/authService";
import { useEffect, useState } from "react";
import { UserInfo } from "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./pages.less";

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

  useEffect(() => {
    if (user) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="background-div">
      <div className="login-container">
        <div className="login-logo">LOGO</div>
        <h1>Log in</h1>
        {error && <Alert message={errorMsg} type="error" showIcon style={{ margin: "1rem 0" }} />}
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
            <div className="register-link">
              or <Link to="/register"> register now!</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
