import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";
import { CssVarsProvider } from "@mui/joy/styles";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import theme from "./theme";
import "./styles/index.css";
import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
const tagManagerArgs = {
  gtmId: "GTM-NPXTHLVJ",
};
TagManager.initialize(tagManagerArgs);

const TRACKING_ID = "G-GNDE5XDS4C";
ReactGA.initialize(TRACKING_ID);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CssVarsProvider theme={theme}>
    <RouterProvider router={router} />
  </CssVarsProvider>
);
