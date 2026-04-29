import { createBrowserRouter } from "react-router";
import Index from "../layout";

import initCore from "../core/init";

async function initRouter() {
  const routerConfig = await initCore();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index routerConfig={routerConfig} />,
      children: routerConfig,
    },
  ]);
  return router;
}

export default initRouter;
