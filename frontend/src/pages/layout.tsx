import clsx from "clsx";
import React from "react";
import { ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import ServiceSignupModal from "../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../components/ServiceSignupModal/ServiceSignupModalContext";

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
    <ServiceSignupModalContextProvider>
      <ScrollRestoration getKey={(location, matches) => location.pathname} />

      <ServiceSignupModal />
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
    </ServiceSignupModalContextProvider>
  );
};

export default Layout;
