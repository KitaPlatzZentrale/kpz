import { createBrowserRouter } from "react-router-dom";
import FourOhFourPage from "./pages/404";
import FinderPage from "./pages/finder";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FinderPage />,
    errorElement: <FourOhFourPage />,
  },
  {
    path: "/finder/",
    element: <FinderPage />,
  },
]);

export default router;
