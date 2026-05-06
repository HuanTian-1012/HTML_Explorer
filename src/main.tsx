import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import initRouter from "./router";
import { ConfigProvider } from "antd";
import "./style/layout.css";
import "./style/scrollbar.css";

async function init() {
  // 先等待路由初始化
  const router = await initRouter();

  // 渲染应用
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ConfigProvider>
        <RouterProvider router={router} />
      </ConfigProvider>
    </StrictMode>,
  );
}

// 启动应用
init();
