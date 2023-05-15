import { Button, Divider } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import theme from "../theme";
import HeaderDesktopNavigation from "./Header/HeaderDesktopNavigation";
import HeaderMobileNavigation from "./Header/HeaderMobileNavigation";
import MenuButton from "./Header/HeaderMobileNavigationButton";
import HeaderNavigationLink from "./Header/HeaderNavigationLink";
import HeaderNavigationLinkList from "./Header/HeaderNavigationLinkList";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLDivElement>;
};

const Header: React.FC<HeaderProps> = ({ headerRef }) => {
  const [mobileOverlayOpen, setMobileOverlayOpen] = React.useState(false);

  return (
    <header
      ref={headerRef}
      id="nav-header"
      className="page-padding z-[205] h-20 w-full bg-white py-4"
    >
      <nav className="flex flex-row items-center justify-between">
        <Link to="/" id="logo-container">
          <div className="h-12 w-64 bg-gray-300" />
        </Link>
        <div
          className="hidden h-full flex-row items-end lg:flex"
          id="nav-links-container"
        >
          <HeaderDesktopNavigation />
        </div>
        <div className="flex flex-row items-center gap-8 lg:hidden">
          <MenuButton
            isOpen={mobileOverlayOpen}
            onClick={() => setMobileOverlayOpen(!mobileOverlayOpen)}
            strokeWidth="3"
            color={theme.palette.primary[600]}
            lineProps={{ strokeLinecap: "round" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            width="24"
            height="20"
            className="cursor-pointer"
          />
          <HeaderMobileNavigation
            open={mobileOverlayOpen}
            onClose={() => setMobileOverlayOpen(false)}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
