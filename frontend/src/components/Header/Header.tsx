import React from "react";
import { Link } from "react-router-dom";
import theme from "../../theme";
import HeaderDesktopNavigation from "./desktop/HeaderDesktopNavigation";
import HeaderMobileNavigation from "./mobile/HeaderMobileNavigation";
import MenuButton from "./mobile/HeaderMobileNavigationButton";
import { useMobileOverlay } from "../MobileOverlay/MobileOverlayContext";

type HeaderProps = {
  headerRef?: React.RefObject<HTMLDivElement>;
};

const Header: React.FC<HeaderProps> = ({ headerRef }) => {
  const {
    isOpen: isHeaderMobileOverlayOpen,
    setOpen: setHeaderMobileOverlayOpen,
  } = useMobileOverlay("header-navigation");

  return (
    <header
      ref={headerRef}
      id="nav-header"
      className="page-padding z-[205] flex h-20 w-full flex-row items-center justify-between border-b border-gray-200 bg-white py-4"
    >
      <nav className="flex w-full flex-row items-center justify-between">
        <Link to="/" id="logo-container" className="w-56 md:w-64">
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
            isOpen={isHeaderMobileOverlayOpen}
            onClick={() =>
              setHeaderMobileOverlayOpen(!isHeaderMobileOverlayOpen)
            }
            strokeWidth="3"
            color={theme.vars.palette.primary[600]}
            lineProps={{ strokeLinecap: "round" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            width="24"
            height="20"
            className="cursor-pointer"
          />
          <HeaderMobileNavigation
            open={isHeaderMobileOverlayOpen}
            onClose={() => setHeaderMobileOverlayOpen(false)}
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
