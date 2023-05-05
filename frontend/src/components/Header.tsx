import React from "react";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLDivElement>;
};

const Header: React.FC<HeaderProps> = ({ headerRef }) => {
  return (
    <header
      ref={headerRef}
      id="nav-header"
      className="page-padding z-[205] w-full bg-white py-5"
    >
      <nav className="flex flex-row items-center justify-between">
        <div id="logo-container">
          <h1 className="text-2xl font-black">KPZ</h1>
        </div>
      </nav>
    </header>
  );
};

export default Header;
