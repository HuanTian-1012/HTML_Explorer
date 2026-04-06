import { Layout } from "antd";
import "./HtLayout.css";
const { Content, Sider } = Layout;
export default function HtLayout() {
  return (
    <Layout className="ht-layout-border">
      <Sider>2342</Sider>
      <Content></Content>
    </Layout>
  );
}
