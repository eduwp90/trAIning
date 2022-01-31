import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthService from '../Services/authService';

const Login: React.FC = () => {
  const onFinish = async (values: any) => {
    console.log('Received values of form: ', values);
    console.log(await AuthService.loginUser(values.email, values.password));
  };

  return (
    <Form
      name='normal_login'
      layout='vertical'
      className='login-form'
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name='email'
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input
          prefix={<UserOutlined className='site-form-item-icon' />}
          placeholder='Email'
        />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className='site-form-item-icon' />}
          type='password'
          placeholder='Password'
        />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit' className='login-form-button'>
          Log in
        </Button>
        Or <Link to='/register'>register now!</Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
