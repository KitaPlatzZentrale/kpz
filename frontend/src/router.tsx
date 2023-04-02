import { createBrowserRouter } from "react-router-dom";
import FinderPage from "./pages/finder";

import IndexPage from "./pages/index";

const router = createBrowserRouter([
  {
    path: "",
    element: <IndexPage />,
  },
  {
    path: "/finder",
    element: <FinderPage />,
  },
]);

export default router;
