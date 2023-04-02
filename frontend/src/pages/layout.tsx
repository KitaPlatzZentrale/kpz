import React from "react";
import Header from "../components/Header";

type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-full flex-col">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
