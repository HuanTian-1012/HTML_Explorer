import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import HtLayout from './layout/HtLayout.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    // element: <div>Hello World</div>,
    Component:HtLayout
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
