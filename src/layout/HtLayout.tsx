import { Outlet, useLocation, useNavigate } from "react-router";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";

import "./HtLayout.css";
import "../style/index.css"

const { Sider, Content, Header } = Layout;

interface PathConfig {
  path: string;
  title: string;
  children: PathConfig[];
}

interface HtLayoutProps {
  routerConfig: PathConfig[];
}

function transformMenuItems(
  routerConfig: PathConfig[],
  parentKey = "group",
): NonNullable<MenuProps["items"]> {
  return routerConfig.map((item, index) => {
    const currentKey = item.path || `${parentKey}-${index}-${item.title}`;
    const children = item.children.length
      ? transformMenuItems(item.children, currentKey)
      : undefined;

    return {
      key: currentKey,
      label: item.title,
      children,
    };
  });
}

export default function HtLayout({ routerConfig }: HtLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems: MenuProps["items"] = [
    { key: "/", label: "首页" },
    ...transformMenuItems(routerConfig),
  ];

  return (
      <Layout className="layout">
        <Header className="header">123</Header>
        <Layout>
          <Sider className="sider">
            <Menu
              className="menu"
              selectedKeys={[location.pathname]}
              items={menuItems}
              mode="inline"
              onClick={({ key }) => {
                if (typeof key === "string" && key.startsWith("/")) {
                  navigate(key);
                }
              }}
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
