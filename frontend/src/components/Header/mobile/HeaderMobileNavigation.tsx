import React from "react";
import { Button, Divider } from "@mui/joy";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useServiceSignupModal } from "../../ServiceSignupModal/ServiceSignupModalContext";
import HeaderNavigationLinkList from "../HeaderNavigationLinkList";

type HeaderMobileNavigationProps = {
  open?: boolean;
  onClose?: () => void;
};

const HeaderMobileNavigation: React.FC<HeaderMobileNavigationProps> = ({
  open: openProp = false,
  onClose,
}) => {
  const { setModalIsOpen: setServiceSignupModalOpen } = useServiceSignupModal();

  const [isOpen, setOpen] = React.useState(openProp);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    openProp !== undefined && setOpen(openProp);
  }, [openProp]);

  const commonHorizontalPadding = "px-6";
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{
            x: window.innerWidth,
          }}
          animate={{
            x: 0,
          }}
          exit={{ x: window.innerWidth }}
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.4,
          }}
          className="page-padding absolute left-0 top-0 z-[99] flex h-full max-h-screen w-full flex-col overflow-hidden rounded-lg bg-white py-24"
        >
          <div
            className={clsx(
              "flex w-full flex-col gap-7 py-3",
              commonHorizontalPadding
            )}
          >
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
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default HeaderMobileNavigation;
