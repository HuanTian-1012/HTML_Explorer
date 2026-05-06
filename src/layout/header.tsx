import { Button, Layout } from "antd";
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
          />
          <Button
            type="text"
            size="large"
          />
        </div>
      </div>
    </AntdHeader>
  );
}
