import React from "react";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLDivElement>;
};

const Header: React.FC<HeaderProps> = ({ headerRef }) => {
  return (
    <header
      ref={headerRef}
      id="nav-header"
      className="page-padding z-50 w-full bg-white py-8"
    >
      <nav className="flex flex-row items-center justify-between">
        <div id="logo-container">
          <h1 className="text-3xl font-black">KitaPlatzZentrale</h1>
        </div>
      </nav>
    </header>
  );
};

export default Header;
