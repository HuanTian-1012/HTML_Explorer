import { createBrowserRouter } from "react-router";
import Index from "../layout";
import HomePage from "../pages/home";

import initCore from "../core/init";

async function initRouter() {
  const routerConfig = await initCore();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index routerConfig={routerConfig} />,
      children: [
        {
          index: true,
          element: <HomePage routerConfig={routerConfig} />,
        },
        ...routerConfig,
      ],
    },
  ]);
  return router;
}

export default initRouter;
