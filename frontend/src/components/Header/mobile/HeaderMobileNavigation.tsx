import React from "react";
import { Button, Divider } from "@mui/joy";
import clsx from "clsx";
import { motion } from "framer-motion";
import HeaderNavigationLinkList from "../HeaderNavigationLinkList";
import MobileOverlay from "../../MobileOverlay/MobileOverlay";
import { useMobileOverlay } from "../../MobileOverlay/MobileOverlayContext";

type HeaderMobileNavigationProps = {
  open?: boolean;
  onClose?: () => void;
};

const HeaderMobileNavigation: React.FC<HeaderMobileNavigationProps> = ({
  open: openProp = false,
  onClose,
}) => {
  const { setOpen: setServiceSignupModalOpen } =
    useMobileOverlay("service-signup");

  const { isOpen, setOpen } = useMobileOverlay("header-navigation");

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    openProp !== undefined && setOpen(openProp);
  }, [openProp]);

  const commonHorizontalPadding = "px-6";
  return (
    <MobileOverlay name="header-navigation" animationDirection="x" hideClose>
      <div
        className={clsx(
          "flex w-full flex-col gap-7 py-3",
          commonHorizontalPadding
        )}
      >
        <div className="h-12" id="header-mobile-navigation-mock" />
        <motion.h2 className="mb-3 text-3xl font-black">Menü</motion.h2>
        <div className="flex w-full flex-col">
          <HeaderNavigationLinkList onLinkClick={() => handleClose()} />
        </div>
        <Divider
          sx={{
            margin: "3rem 0rem 1rem",
          }}
          component="div"
          orientation="horizontal"
        />
        <Button
          href="/finder"
          variant="solid"
          color="primary"
          size="lg"
          className="w-fit shadow-md"
          sx={{ padding: "1.25rem 2rem" }}
          onClick={() => {
            handleClose();
            setServiceSignupModalOpen(true);
          }}
        >
          Platz finden lassen
        </Button>
      </div>
    </MobileOverlay>
  );
};

export default HeaderMobileNavigation;
