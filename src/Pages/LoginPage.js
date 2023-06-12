import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, theme } from "antd";
import styled from "@emotion/styled";
import { Logo } from "./Layout";

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const LoginPage = ({ login }) => {
  const {
    token: { colorBgLayout, borderRadiusLG },
  } = theme.useToken();

  const LoginBackground = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: ${colorBgLayout};
  `;

  const LoginFormContainer = styled.div`
    background-color: white;
    border-radius: ${borderRadiusLG}px;
    overflow: hidden;
  `;
  const [form] = Form.useForm();

  const onFinish = async ({ username, password }) => {
    console.log("Received values of form: ", { username, password });

    const success = await login(username, password);

    if (!success) {
      form.setFields([
        {
          name: "username",
          errors: ["Invalid username/password combination."],
        },
      ]);
    }
  };

  return (
    <LoginBackground>
      <LoginFormContainer>
        <div style={{ backgroundColor: "#001529" }}>
          <Logo />
        </div>
        <div style={{ padding: "2em" }}>
          <Form
            form={form}
            name="normal_login"
            className="login-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            {/* 
            <Form.Item>
              <a className="login-form-forgot" href="">
                I forgot my password
              </a>
            </Form.Item> 
            */}

            <ButtonRow>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              <div>
                Or <a href="">register now!</a>
              </div>
            </ButtonRow>
          </Form>
        </div>
      </LoginFormContainer>
    </LoginBackground>
  );
};

export default LoginPage;
