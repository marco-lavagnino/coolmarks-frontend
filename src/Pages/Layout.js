import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../logo.png";
import React, { Suspense } from "react";
const { Header, Sider, Content } = Layout;

const LogoSection = styled.div`
  padding: 32px;
  font-size: 24px;
  color: white;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const NoMatch = () => <div>NoMatch</div>;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export const Logo = () => (
  <LogoSection>
    <img src={logo} alt="logo" style={{ height: 50 }}></img>
    <div>CoolMarks</div>
  </LogoSection>
);

const CoolMarksLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null}>
        <Logo />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "",
              icon: <UserOutlined />,
              label: "My Links",
            },
            {
              key: "bulk_add",
              icon: <VideoCameraOutlined />,
              label: "Bulk Add",
            },
          ]}
          onClick={({ key }) => navigate(`/${key}`)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}></Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <ErrorBoundary>
            <Suspense fallback={"loading"}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CoolMarksLayout;
