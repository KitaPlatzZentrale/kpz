import { Button, Divider } from "@mui/joy";
import React from "react";
import { useServiceSignupModal } from "../../ServiceSignupModal/ServiceSignupModalContext";
import HeaderNavigationLinkList from "../HeaderNavigationLinkList";

type HeaderDesktopNavigationProps = {};

const HeaderDesktopNavigation: React.FC<HeaderDesktopNavigationProps> = () => {
  const { setModalIsOpen: setServiceSignupModalOpen } = useServiceSignupModal();
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
        href="/finder"
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
