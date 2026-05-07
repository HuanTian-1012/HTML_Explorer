import { useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { Card, Layout } from "antd";
import type { RouterPathConfig } from "../core/type";

import style from "./index.module.css";
import Header from "./header";
import Left from "./left";
import Right from "./right";

const { Sider, Content } = Layout;
export default function Index({
  routerConfig,
}: {
  routerConfig: RouterPathConfig[];
}) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  return (
    <Layout className={style.layout}>
      <Header />
      <Layout>
        {/* 左侧菜单栏 */}
        <Sider className={style.sider}>
          <Left
            routerConfig={routerConfig}
            selectedKeys={[decodeURIComponent(location.pathname)]}
          />
        </Sider>
        {/* 内容区域 */}
        <Content className={style.content}>
          <Right contentRef={contentRef} />
          <div ref={contentRef}>
            <Card hoverable={true}>
              <Outlet />
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
