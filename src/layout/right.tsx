import { useEffect, useState, type RefObject } from "react";
import { Anchor, Typography } from "antd";

import "./right.css";
import { useLocation } from "react-router";

const { Text } = Typography;

interface HeadingItem {
  key: string;
  href: string;
  title: string;
  level: number;
}

interface RightProps {
  contentRef: RefObject<HTMLDivElement | null>;
}

export default function Right({ contentRef }: RightProps) {
  const location = useLocation();
  const [headingItems, setHeadingItems] = useState<HeadingItem[]>([]);

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
  }, [location.pathname, contentRef]);
  
  return (
    <div className="tocCard">
      <Text className="tocTitle">本文目录</Text>
      <Anchor
        getContainer={() => contentRef.current?.parentElement || window}
        className="tocAnchor"
        items={headingItems.map((item) => ({
          key: item.key,
          href: item.href,
          title: (
            <span className={`tocLink tocLevel${Math.min(item.level, 4)}`}>
              {item.title}
            </span>
          ),
        }))}
        offsetTop={80}
      />
    </div>
  );
}
