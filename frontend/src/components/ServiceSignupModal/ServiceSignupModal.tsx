import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import ServiceSignupIntroView from "./views/ServiceSignupIntroView";
import WizardContextProvider, { WizardContext } from "./WizardContext";
import ServiceSignupFormView from "./views/ServiceSignupFormView";
import ServiceSignupFormContextProvider from "./ServiceSignupFormContext";
import { useServiceSignupModal } from "./ServiceSignupModalContext";
import Wizard from "./Wizard";

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
  const res = await fetch("http://localhost:3000/anmeldungen/service", {
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
  });

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
  const { modalIsOpen, setModalIsOpen } = useServiceSignupModal();

  const handleClose = () => {
    setModalIsOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    open !== undefined && setModalIsOpen(open);
  }, [open]);

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
        <ServiceSignupFormContextProvider
          onSubmit={async (data) => {
            const success = await submitServiceSignupAction(
              data as ServiceSignupActionPayload
            );
            return success;
          }}
        >
          <WizardContextProvider>
            <div className="mb-4 flex flex-row-reverse">
              <ModalClose
                sx={{ position: "relative", top: 0, right: "-16px" }}
                onClick={handleClose}
              />
            </div>
            <Wizard />
          </WizardContextProvider>
        </ServiceSignupFormContextProvider>
      </ModalDialog>
    </Modal>
  );
};

export default ServiceSignupModal;
