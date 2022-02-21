import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { register } from "../redux/auth-slice";
import { openErrNotification } from "../utils/errorNoti";

export const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginNavigation = () => {
    navigate("/login");
  };

  const onRegister = async (user_input: {
    username: string;
    password: string;
  }) => {
    try {
      await dispatch(register(user_input)).unwrap();

      // re-direct user to dashboard page
      loginNavigation();
    } catch (err_msg: any) {
      openErrNotification(err_msg);
    }
  };

  return (
    <div className="form-wrapper">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onRegister}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            autoComplete="on"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            autoComplete="on"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
        </Form.Item>

        <Form.Item>
          <button
            onClick={loginNavigation}
            type="button"
            className="btn register-trigger"
          >
            Already have an account? <span>Log In now!</span>
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};
