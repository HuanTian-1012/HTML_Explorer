import { Button, Layout } from "antd";
import style from "./header.module.css";

const { Header: AntdHeader } = Layout;

export default function Header() {
  return (
    <AntdHeader className={style.background}>
      <div className={style.content}>
        <div>HTML Explorer</div>
        <div className={style.actions}>
          <Button type="text" size="large" />
          <Button type="text" size="large" />
        </div>
      </div>
    </AntdHeader>
  );
}
