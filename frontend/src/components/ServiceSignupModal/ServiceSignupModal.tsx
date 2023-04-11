import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import ServiceSignupIntroView from "./views/ServiceSignupIntroView";
import WizardContextProvider, { WizardContext } from "./WizardContext";
import ServiceSignupFormView from "./views/ServiceSignupFormView";
import ServiceSignupFormContextProvider from "./ServiceSignupFormContext";
import { useServiceSignupModal } from "./ServiceSignupModalContext";
import WizardSteps from "./WizardSteps";
import Wizard from "./Wizard";

const submitEmailAction = async (email: string) => {
  const res = await fetch("http://localhost:3000/anmeldungen/einzel", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Hanno Grimm",
      email,
      kitaName: "Kita 1",
      interneKitaId: "1",
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
        <ServiceSignupFormContextProvider>
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
