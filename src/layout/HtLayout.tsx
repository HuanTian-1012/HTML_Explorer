import { Outlet, useLocation, useNavigate } from "react-router";
import { Layout, Menu } from "antd";
import "./HtLayout.css";

const { Sider, Content,Header } = Layout;

const menuItems = [
  { key: "/", label: "首页" },
  { key: "/element/p", label: "p 标签" },
  { key: "/element/h1", label: "h1 标签" },
  { key: "/element/div", label: "div 标签" },
  { key: "/element/span", label: "span 标签" },
];

export default function HtLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="layout">
      <Header>123</Header>
      <Layout>
        <Sider className="sider">
          <Menu
            className="menu"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Content>
          <div className="content">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
