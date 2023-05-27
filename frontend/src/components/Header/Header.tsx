import { Button, Divider } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";
import theme from "../../theme";
import HeaderDesktopNavigation from "./desktop/HeaderDesktopNavigation";
import HeaderMobileNavigation from "./mobile/HeaderMobileNavigation";
import MenuButton from "./mobile/HeaderMobileNavigationButton";
import HeaderNavigationLink from "./HeaderNavigationLink";
import HeaderNavigationLinkList from "./HeaderNavigationLinkList";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLDivElement>;
};

const Header: React.FC<HeaderProps> = ({ headerRef }) => {
  const [mobileOverlayOpen, setMobileOverlayOpen] = React.useState(false);

  return (
    <header
      ref={headerRef}
      id="nav-header"
      className="page-padding z-[205] flex h-20 w-full flex-row items-center justify-between border-b border-gray-200 bg-white py-4"
    >
      <nav className="flex w-full flex-row items-center justify-between">
        <Link to="/" id="logo-container" className="w-56 md:w-72">
          <img src="/logo.svg" width="100%" alt="KitaPlatzZentrale Logo" />
        </Link>
        <div
          className="hidden h-full flex-row items-end xl:flex"
          id="nav-links-container"
        >
          <HeaderDesktopNavigation />
        </div>
        <div className="flex flex-row items-center gap-8 xl:hidden">
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
