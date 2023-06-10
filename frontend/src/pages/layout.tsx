import clsx from "clsx";
import React from "react";
import { ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import MobileOverlayContextProvider from "../components/MobileOverlay/MobileOverlayContext";
import ServiceSignupModal from "../components/Modals/ServiceSignup/ServiceSignup";
import SingleKitaSignupFormContextProvider from "../components/Modals/SingleKitaSignup/SingleKitaSignupFormContext";
import SingleKitaSignup, {
  submitEmailAction,
} from "../components/Modals/SingleKitaSignup/SingleKitaSignup";

type LayoutProps = React.PropsWithChildren<{
  lockAtScreenHeight?: boolean;
  headerRef?: React.RefObject<HTMLDivElement>;
}>;

const Layout: React.FC<LayoutProps> = ({
  children,
  lockAtScreenHeight = false,
  headerRef,
}) => {
  return (
    <MobileOverlayContextProvider>
      <SingleKitaSignupFormContextProvider onSubmit={submitEmailAction}>
        <ScrollRestoration getKey={(location, matches) => location.pathname} />

        <ServiceSignupModal />
        <SingleKitaSignup />
        <div
          className={clsx(
            "flex min-h-[120vh] flex-col",
            lockAtScreenHeight ? "max-h-screen overflow-hidden" : "h-full"
          )}
        >
          {lockAtScreenHeight && (
            <style>
              {`
            html, body {
              overflow-y: hidden;
            }
              `}
            </style>
          )}
          <Header headerRef={headerRef} />
          {children}
          <Footer />
        </div>
      </SingleKitaSignupFormContextProvider>
    </MobileOverlayContextProvider>
  );
};

export default Layout;
