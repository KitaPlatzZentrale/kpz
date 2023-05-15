import clsx from "clsx";
import React from "react";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header";

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
    <div
      className={clsx(
        "flex flex-col",
        lockAtScreenHeight ? "max-h-screen overflow-hidden" : "h-full"
      )}
    >
      <Header headerRef={headerRef} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
