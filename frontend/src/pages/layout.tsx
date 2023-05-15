import clsx from "clsx";
import React from "react";
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
    </div>
  );
};

export default Layout;
