import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { login } from "../../redux/auth-slice";
import { openErrNotification } from "../../utils/antdNoti";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogin = async (user_input: {
    username: string;
    password: string;
  }) => {
    try {
      await dispatch(login(user_input)).unwrap();

      // re-direct user to dashboard page
      navigate("/");
    } catch (err_msg: any) {
      openErrNotification(err_msg);
    }
  };

  const registerNavigation = () => {
    navigate("/signup");
  };

  return (
    <div className="form-wrapper">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onLogin}
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
            Log in
          </Button>
        </Form.Item>

        <Form.Item>
          <button
            onClick={registerNavigation}
            type="button"
            className="btn register-trigger"
          >
            Or register now!
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};
