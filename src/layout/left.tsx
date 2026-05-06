import { Menu } from "antd";
import type { MenuProps } from "antd";

import "./left.css";
import { useNavigate } from "react-router";
import type { RouterPathConfig } from "../core/type";

interface LeftProps {
  routerConfig: RouterPathConfig[];
  selectedKeys: string[];
}

/** 
 * 菜单转换函数
 * @description 将路由配置转换为菜单项
 */
function transformMenuItems(
  routerConfig: RouterPathConfig[],
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

export default function Left({ routerConfig, selectedKeys }: LeftProps) {
  // 跳转方法
  const navigate = useNavigate();
  // 菜单项
  const menuItems: MenuProps["items"] = [
    { key: "/", label: "首页" },
    ...transformMenuItems(routerConfig),
  ];

  return (
    <Menu
      className="menu"
      selectedKeys={selectedKeys}
      items={menuItems}
      mode="inline"
      onClick={({ key }) => {
        if (typeof key === "string" && key.startsWith("/")) {
          navigate(key);
        }
      }}
    />
  );
}
