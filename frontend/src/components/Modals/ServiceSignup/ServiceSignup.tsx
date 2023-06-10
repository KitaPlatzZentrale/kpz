import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import WizardContextProvider from "./WizardContext";
import ServiceSignupFormContextProvider from "./ServiceSignupFormContext";
import Wizard from "./Wizard";
import { useMobileOverlay } from "../../MobileOverlay/MobileOverlayContext";
import MobileOverlay from "../../MobileOverlay/MobileOverlay";

type ServiceSignupActionPayload = {
  email: string;
  fullAddress: string;
  desiredStartMonth: string;
  expectedBirthDate: string;
};

const submitServiceSignupAction = async ({
  email,
  fullAddress,
  desiredStartMonth,
  expectedBirthDate,
}: ServiceSignupActionPayload) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/signup/service`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        fullAddress,
        desiredStartMonth,
        expectedBirthDate,
      }),
    }
  );

  return res.ok;
};

type ServiceSignupModalProps = {
  open?: boolean;
  onClose?: () => void;
};

const ServiceSignupModal: React.FC<ServiceSignupModalProps> = ({
  open,
  onClose,
}) => {
  const { isOpen: modalIsOpen, setOpen: setModalIsOpen } =
    useMobileOverlay("service-signup");

  const handleClose = () => {
    setModalIsOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    open !== undefined && setModalIsOpen(open);
  }, [open]);

  const Common = () => {
    return (
      <ServiceSignupFormContextProvider
        onSubmit={async (data) => {
          const success = await submitServiceSignupAction(
            data as ServiceSignupActionPayload
          );
          return success;
        }}
      >
        <WizardContextProvider>
          <Wizard />
        </WizardContextProvider>
      </ServiceSignupFormContextProvider>
    );
  };

  const DesktopModal = ({ children }) => {
    return (
      <Modal open={modalIsOpen} onClose={handleClose}>
        <ModalDialog
          sx={{
            paddingBottom: "24px",
            paddingRight: "40px",
            paddingLeft: "40px",
            paddingTop: "20px",
            border: "none",
          }}
          className="w-full max-w-xl"
        >
          <div className="mb-4 flex flex-row-reverse">
            <ModalClose
              sx={{ position: "relative", top: 0, right: "-16px" }}
              onClick={handleClose}
            />
          </div>
          {children}
        </ModalDialog>
      </Modal>
    );
  };

  const MobileMobileOverlay = ({ children }) => {
    return (
      <MobileOverlay name="service-signup" animationDirection="y">
        {children}
      </MobileOverlay>
    );
  };

  const Container =
    document.body.clientWidth > 768 ? DesktopModal : MobileMobileOverlay;

  return (
    <Container>
      <Common />
    </Container>
  );
};

export default ServiceSignupModal;
