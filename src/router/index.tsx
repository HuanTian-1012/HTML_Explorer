import { createBrowserRouter } from "react-router";
import HtLayout from "../layout/HtLayout";

import initCore from "../core/init";

async function initRouter() {
  const routerConfig = await initCore();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HtLayout routerConfig={routerConfig} />,
      children: routerConfig,
    },
  ]);
  return router;
}

export default initRouter;
