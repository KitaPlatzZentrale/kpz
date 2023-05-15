import { createBrowserRouter } from "react-router-dom";
import FinderPage from "./pages/finder";
import PrivacyPage from "./pages/privacy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FinderPage />,
  },
  {
    path: "/finder/",
    element: <FinderPage />,
  },
  {
    path: "/datenschutzerklaerung",
    element: <PrivacyPage />,
  },
]);

export default router;
