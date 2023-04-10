import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import ServiceSignupIntroView from "./views/ServiceSignupIntroView";
import WizardContextProvider, { WizardContext } from "./WizardContext";
import ServiceSignupFormView from "./views/ServiceSignupFormView";
import ServiceSignupFormContextProvider from "./ServiceSignupFormContext";

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
  open: boolean;
  onClose?: () => void;
};

const ServiceSignupModal: React.FC<ServiceSignupModalProps> = ({
  open = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = React.useState(open);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
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
          <WizardContextProvider
            activeStepIndex={0}
            steps={[
              {
                view: <ServiceSignupIntroView />,
                valid: true,
              },
              {
                view: <ServiceSignupFormView />,
              },
            ]}
          >
            <div className="mb-4 flex flex-row-reverse">
              <ModalClose
                sx={{ position: "relative", top: 0, right: "-16px" }}
                onClick={() => setIsOpen(false)}
              />
            </div>
            <WizardContext.Consumer>
              {({ activeStepIndex, steps }) =>
                steps[activeStepIndex]?.view || null
              }
            </WizardContext.Consumer>
          </WizardContextProvider>
        </ServiceSignupFormContextProvider>
      </ModalDialog>
    </Modal>
  );
};

export default ServiceSignupModal;
