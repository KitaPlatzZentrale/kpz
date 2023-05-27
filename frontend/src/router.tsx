import { createBrowserRouter } from "react-router-dom";
import FourOhFourPage from "./pages/404";
import FinderPage from "./pages/finder";
import PrivacyPage from "./pages/privacy";
import ImprintPage from "./pages/imprint";
import IndexPage from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    errorElement: <FourOhFourPage />,
  },
  {
    path: "/finder/",
    element: <FinderPage />,
  },
  {
    path: "/datenschutzerklaerung",
    element: <PrivacyPage />,
  },
  {
    path: "/impressum",
    element: <ImprintPage />,
  },
]);

export default router;
