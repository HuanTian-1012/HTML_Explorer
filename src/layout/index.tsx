import { useRef } from "react";
import { Outlet } from "react-router";
import { Layout } from "antd";
import type { RouterPathConfig } from "../core/type";

import "./index.css";
import Header from "./header";
import Left from "./left";
import Right from "./right";

const { Sider, Content } = Layout;
export default function Index({ routerConfig }: { routerConfig: RouterPathConfig[] }) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <Layout className="layout">
      <Header className="header" />
      <Layout>
        {/* 左侧菜单栏 */}
        <Sider className="sider">
          <Left
            routerConfig={routerConfig}
            selectedKeys={[location.pathname]}
          />
        </Sider>
        {/* 内容区域 */}
        <Content className="content">
          <div ref={contentRef}>
            <Outlet />
          </div>
        </Content>
        {/* 右侧内容栏 */}
        <Sider className="sider">
          <Right contentRef={contentRef} />
        </Sider>
      </Layout>
    </Layout>
  );
}
