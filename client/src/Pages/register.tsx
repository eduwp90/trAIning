import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, Alert } from 'antd';
import AuthService from '../Services/authService';
import { useNavigate } from 'react-router';
import { UserInfo } from '@firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Register: React.FC = () => {
  const [form] = Form.useForm();

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(AuthService.auth);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(false);

    const res: UserInfo | string = await AuthService.signupUser(
      values.email,
      values.password
    );

    if (typeof res === 'string') {
      setError(true);
      setErrorMsg(res);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {error && <Alert message={errorMsg} type='error' showIcon />}
      <Form
        layout='vertical'
        form={form}
        name='register'
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name='email'
          label='E-mail'
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name='password'
          label='Password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Confirm Password'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
