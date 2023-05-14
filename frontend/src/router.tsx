import { createBrowserRouter } from "react-router-dom";
import FinderPage from "./pages/finder";
import ImprintPage from "./pages/imprint";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FinderPage />,
  },
  {
    path: "/finder",
    element: <FinderPage />,
  },
  {
    path: "/impressum",
    element: <ImprintPage />,
  },
]);

export default router;
