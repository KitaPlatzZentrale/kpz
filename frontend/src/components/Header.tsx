import { Button, Divider } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLDivElement>;
};

type NavLinkProps = React.PropsWithChildren<{
  to: string;
  active?: boolean;
}>;

const NavLink: React.FC<NavLinkProps> = ({ to, active = false, children }) => {
  const inactiveColor = "#966657";

  return (
    <li
      className={clsx(
        "h-full cursor-pointer after:relative after:float-left after:mt-[8px] after:h-1 after:w-full after:rounded-full after:transition-opacity active:after:transition-opacity",
        active
          ? `after:bg-primary-dark after:opacity-100`
          : `after:bg-[${inactiveColor}] after:opacity-0 hover:after:opacity-30 active:after:opacity-100`
      )}
    >
      <Link
        className={clsx(
          "h-full",
          active
            ? `font-extrabold text-primary-dark`
            : `text-[${inactiveColor}] font-bold`
        )}
        to={to}
      >
        {children}
      </Link>
    </li>
  );
};

const Header: React.FC<HeaderProps> = ({ headerRef }) => {
  return (
    <header
      ref={headerRef}
      id="nav-header"
      className="page-padding z-[205] h-20 w-full bg-white py-4"
    >
      <nav className="flex flex-row items-center justify-between">
        <div id="logo-container">
          <div className="h-12 w-64 bg-gray-300" />
        </div>
        <div
          className="flex h-full flex-row items-end"
          id="nav-links-container"
        >
          <ul className="flex h-full flex-row items-center justify-between gap-8">
            <NavLink to="/" active>
              Startseite
            </NavLink>
            <NavLink to="/finder">Kita-Karte</NavLink>
            <NavLink to="/about">Über uns</NavLink>
          </ul>
          <Divider
            sx={{
              margin: "0 3rem",
            }}
            component="div"
            orientation="vertical"
            className="mx-8"
          />
          <Button
            variant="solid"
            color="primary"
            size="lg"
            className="shadow-md"
          >
            Platz finden
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
