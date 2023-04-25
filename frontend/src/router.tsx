import { createBrowserRouter } from "react-router-dom";
import FinderPage from "./pages/finder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FinderPage />,
  },
  {
    path: "/finder/",
    element: <FinderPage />,
  },
]);

export default router;
