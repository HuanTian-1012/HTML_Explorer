import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import initRouter from "./router";
import { ConfigProvider } from "antd";
import "./App.css";

// 应用初始化
async function init() {
  // 初始化路由
  const router = await initRouter();

  // 渲染应用
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ConfigProvider theme={'dark'}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </StrictMode>,
  );
}
init();
