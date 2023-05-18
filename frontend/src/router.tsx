import { createBrowserRouter } from "react-router-dom";
import FourOhFourPage from "./pages/404";
import FinderPage from "./pages/finder";
import ImprintPage from "./pages/imprint";

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
  {
    path: "/impressum",
    element: <ImprintPage />,
  },
]);

export default router;
