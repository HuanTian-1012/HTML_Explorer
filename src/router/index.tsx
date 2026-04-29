import { createBrowserRouter } from "react-router";
import HtLayout from "../layout/HtLayout";
import Index from "../views/Index";
import DivDocument from "../views/elements/div";
import SpanDocument from "../views/elements/span";
import PDocument from "../views/elements/p";
import H1Document from "../views/elements/h1";

import initCore from "../core/init";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HtLayout />,

    children: [
      {
        path: "/",
        element: <Index />,
      },
      { path: "element/p", element: <PDocument /> },
      { path: "element/h1", element: <H1Document /> },
      { path: "element/div", element: <DivDocument /> },
      { path: "element/span", element: <SpanDocument /> },
    ],
  },
]);

export default router;
