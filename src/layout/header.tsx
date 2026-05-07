import { Button, Layout } from "antd";
import style from "./header.module.css";
import { GithubOutlined, SunOutlined } from "@ant-design/icons";

const { Header: AntdHeader } = Layout;

export default function Header() {
  return (
    <AntdHeader className={style.background}>
      <div className={style.content}>
        <div>HTML Explorer</div>
        <div className={style.actions}>
          <Button type="text" size="large" icon={<SunOutlined />} />
          <Button type="text" size="large" icon={<GithubOutlined />} />
        </div>
      </div>
    </AntdHeader>
  );
}
