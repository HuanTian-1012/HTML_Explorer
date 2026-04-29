import { Button, Layout } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import "./header.css";

const { Header: AntdHeader } = Layout;

export default function Header({ className }: { className?: string }) {
  return (
    <AntdHeader className={className}>
      <div className="header-content">
        <div>HTML Explorer</div>
        <div className="header-actions">
          <Button
            type="text"
            size="large"
            icon={<GithubOutlined className="icon" />}
          />
          <Button
            type="text"
            size="large"
            icon={<GithubOutlined className="icon" />}
          />
        </div>
      </div>
    </AntdHeader>
  );
}
