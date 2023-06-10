import { Button, Divider } from "@mui/joy";
import React from "react";
import HeaderNavigationLinkList from "../HeaderNavigationLinkList";
import { useMobileOverlay } from "../../MobileOverlay/MobileOverlayContext";

type HeaderDesktopNavigationProps = {};

const HeaderDesktopNavigation: React.FC<HeaderDesktopNavigationProps> = () => {
  const { setOpen: setServiceSignupModalOpen } =
    useMobileOverlay("service-signup");

  return (
    <>
      <HeaderNavigationLinkList />
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
        onClick={() => setServiceSignupModalOpen(true)}
      >
        Platz finden lassen
      </Button>
    </>
  );
};

export default HeaderDesktopNavigation;
