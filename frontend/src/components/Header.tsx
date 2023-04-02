import React from "react";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="w-full bg-white px-20 py-16">
      <nav className="flex flex-row items-center justify-between">
        <div id="logo-container">
          <h1 className="text-3xl font-black">KitaPlatzZentrale</h1>
        </div>
      </nav>
    </header>
  );
};

export default Header;
