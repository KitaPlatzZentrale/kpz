import { ModalClose } from "@mui/joy";
import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";

import { useMobileOverlay } from "./MobileOverlayContext";

type MobileOverlayProps = React.PropsWithChildren<{
  onClose?: () => void;
  name: string;
  animationDirection?: "x" | "y";
  hideClose?: boolean;
}>;

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  onClose,
  children,
  name,
  animationDirection = "y",
  hideClose = false,
}) => {
  const { isOpen, setOpen, z } = useMobileOverlay(name);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const commonHorizontalPadding = "px-4";
  return (
    <>
      {isOpen ? (
        <motion.div
          initial={
            animationDirection === "y"
              ? {
                  y: window.innerHeight,
                }
              : {
                  x: window.innerWidth,
                }
          }
          animate={
            animationDirection === "y"
              ? {
                  y: 0,
                }
              : {
                  x: 0,
                }
          }
          exit={
            animationDirection === "y"
              ? {
                  y: window.innerHeight,
                }
              : {
                  x: window.innerWidth,
                }
          }
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.5,
          }}
          className={clsx(
            "absolute left-0 top-0 z-[300] flex h-full max-h-screen w-full flex-col overflow-hidden rounded-lg bg-white",
            isOpen && "open-overlay"
          )}
        >
          {!hideClose && (
            <motion.div
              animate={{ x: 0 }}
              initial={{ x: 70 }}
              transition={{ delay: 0.275 }}
              className={clsx(
                "flex flex-row items-center justify-between py-3",
                commonHorizontalPadding
              )}
            >
              <ModalClose
                variant="soft"
                size="md"
                color="neutral"
                onClick={handleClose}
                style={{
                  position: "relative",
                  top: 0,
                  right: 0,
                  marginLeft: "auto",
                }}
              />
            </motion.div>
          )}

          {children}
        </motion.div>
      ) : null}
    </>
  );
};

export default MobileOverlay;
