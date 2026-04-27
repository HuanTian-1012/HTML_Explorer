import { Input, Card } from "antd";
import { useState } from "react";
import "./Code.css";

const { TextArea } = Input;

const TabList = [
  { key: "html", tab: "HTML" },
  { key: "css", tab: "CSS" },
  { key: "javascript", tab: "Javascript" },
];

export default function Code({
  html,
  css,
  js,
}: {
  html?: string;
  css?: string;
  js?: string;
}) {
  const [h, updateHtml] = useState(html ?? "");
  const [c, updateCss] = useState(css ?? "");
  const [j, updateJs] = useState(js ?? "");

  // Tab
  const [activeTab, updateActiveTab] = useState("html");

  // 使用的输入框
  const activeInput = () => {
    switch (activeTab) {
      case "html":
        return <CodeInput code={h} onUpdateCode={updateHtml} />;
      case "css":
        return <CodeInput code={c} onUpdateCode={updateCss} />;
      case "javascript":
        return <CodeInput code={j} onUpdateCode={updateJs} />;
    }
  };

  // 完整的代码
  const fullCode = `
<html>
  <body>${h}</body>
  <style>
  html{
    padding: 0;
    margin: 0;
  }
  ${c}
  </style>
  <script>${j}</script>
</html>
  `;

  return (
    <>
      <div className="background">
        <Card
          classNames={{
            body: "body",
          }}
          activeTabKey={activeTab}
          tabList={TabList}
          onTabChange={(key: string) => {
            updateActiveTab(key);
          }}
        >
          {activeInput()}
        </Card>
        <Card
          classNames={{
            body: "body",
          }}
        >
          <CodeDocument code={fullCode} />
        </Card>
      </div>
    </>
  );
}

/** 输入框 */
function CodeInput({
  code,
  onUpdateCode,
}: {
  code: string;
  onUpdateCode: (code: string) => void;
}) {
  return (
    <TextArea
      value={code}
      variant="borderless"
      style={{ fontSize: "1.2em" }}
      autoSize={{ minRows: 10, maxRows: 10 }}
      onChange={(e) => onUpdateCode(e.target.value)}
    />
  );
}

/** 展示 */
function CodeDocument({ code }: { code: string }) {
  return (
    <>
      <iframe
        className="iframe"
        srcDoc={code}
        onError={(e) => {
          console.log(e);
        }}
      />
    </>
  );
}
