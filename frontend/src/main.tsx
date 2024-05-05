import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";
import { CssVarsProvider, ThemeProvider } from "@mui/joy";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./styles/index.css";
import theme from "./theme";
import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";
const tagManagerArgs = {
  gtmId: "GTM-NPXTHLVJ",
};
TagManager.initialize(tagManagerArgs);

const TRACKING_ID = "G-GNDE5XDS4C";
ReactGA.initialize(TRACKING_ID);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={theme}>
    <CssVarsProvider theme={theme}>
      <RouterProvider router={router} />
    </CssVarsProvider>
  </ThemeProvider>
);
