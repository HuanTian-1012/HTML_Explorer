import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Anchor, Layout, Menu, Typography } from "antd";
import type { MenuProps } from "antd";

import "./index.css";
import Header from "./header";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface PathConfig {
  path: string;
  title: string;
  children: PathConfig[];
}

interface HtLayoutProps {
  routerConfig: PathConfig[];
}

interface HeadingItem {
  key: string;
  href: string;
  title: string;
  level: number;
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

export default function Index({ routerConfig }: HtLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [headingItems, setHeadingItems] = useState<HeadingItem[]>([]);
  const menuItems: MenuProps["items"] = [
    { key: "/", label: "首页" },
    ...transformMenuItems(routerConfig),
  ];

  useEffect(() => {
    function collectHeadings() {
      if (!contentRef.current) {
        setHeadingItems([]);
        return;
      }

      const headings = Array.from(
        contentRef.current.querySelectorAll("h1, h2, h3, h4"),
      );

      const items = headings.map((heading, index) => {
        const text = heading.textContent?.trim() || `标题 ${index + 1}`;
        const id = heading.id || `doc-heading-${index}`;
        heading.id = id;

        return {
          key: id,
          href: `#${id}`,
          title: text,
          level: Number(heading.tagName.slice(1)),
        };
      });

      setHeadingItems(items);
    }

    const frameId = window.requestAnimationFrame(collectHeadings);
    const observer = new MutationObserver(() => {
      collectHeadings();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <Layout className="layout">
      <Header className="header" />
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
        <Content className="content">
          <div ref={contentRef}>
            <Outlet />
          </div>
        </Content>
        <Sider className="sider">
          <aside className="toc">
            <div className="tocCard">
              <Text className="tocTitle">本文目录</Text>
              <Anchor
                className="tocAnchor"
                items={headingItems.map((item) => ({
                  key: item.key,
                  href: item.href,
                  title: (
                    <span
                      className={`tocLink tocLevel${Math.min(item.level, 4)}`}
                    >
                      {item.title}
                    </span>
                  ),
                }))}
                offsetTop={80}
              />
            </div>
          </aside>
        </Sider>
      </Layout>
    </Layout>
  );
}
