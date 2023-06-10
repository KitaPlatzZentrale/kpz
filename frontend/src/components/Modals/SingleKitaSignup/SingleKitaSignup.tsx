import { CheckCircle, MailOutline } from "@mui/icons-material";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";

import Balancer from "react-wrap-balancer";
import FormField from "../../FormField";

import MobileOverlay from "../../MobileOverlay/MobileOverlay";
import { useMobileOverlay } from "../../MobileOverlay/MobileOverlayContext";
import { Kita } from "../../../types";
import {
  useSingleKitaSignupFormContext,
  FormFields,
} from "./SingleKitaSignupFormContext";

type SingleKitaSignupProps = {
  onClose?: () => void;
};

export const submitEmailAction = async (values: FormFields) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/signup/single`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  return res.ok;
};

const SingleKitaSignup: React.FC<SingleKitaSignupProps> = ({ onClose }) => {
  const { isOpen: modalIsOpen, setOpen: setModalIsOpen } =
    useMobileOverlay("single-kita-signup");

  const { register, isLoading, handleSubmit, watch } =
    useSingleKitaSignupFormContext();

  const onSubmit = async () => {
    try {
      await handleSubmit();
      setWasSuccessfullySubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] =
    React.useState(false);

  const handleClose = () => {
    setModalIsOpen(false);
    setWasSuccessfullySubmitted(false);
    onClose?.();
  };

  const emailFields = register("email");

  const kitaName = watch("kitaName");

  const Common = () => (
    <>
      {!wasSuccessfullySubmitted ? (
        <div className="px-3">
          <div className="mb-8 w-full">
            <h3 className="mb-2 text-xl font-black">
              Email Benachrichtigungen
            </h3>
            <Balancer className="text-base">
              Wir werden Sie schnell per Email benachrichtigen, sobald die
              Tageseinrichtung <strong>{kitaName}</strong> wieder Kapazitäten
              hat.
            </Balancer>
          </div>
          <div className="w-full">
            <FormField
              inputProps={{
                startDecorator: <MailOutline />,
                ...emailFields,
                autoComplete: "email",
                disabled: isLoading,
              }}
              label="Email Adresse"
              placeholder="Ihre Email Adresse"
            />
          </div>
          <div className="mt-8 flex w-full flex-row-reverse">
            <Button
              loading={isLoading}
              variant="solid"
              size="lg"
              color="primary"
              type="submit"
              onClick={async () => await onSubmit()}
            >
              Benachrichtigen lassen
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <CheckCircle color="info" fontSize="xl7" />
          </div>
          <div className="mb-4 flex flex-col items-center p-2">
            <h3 className="mb-2 text-2xl font-black">
              Erfolgreich eingereicht.
            </h3>
            <Balancer className="text-center text-base font-semibold text-gray-500">
              Wir werden Sie schnell per Email benachrichtigen, sobald diese
              Kita wieder Kapazitäten hat.
            </Balancer>
          </div>
          <Button
            fullWidth
            size="lg"
            variant="soft"
            color="neutral"
            onClick={handleClose}
          >
            Schließen
          </Button>
        </div>
      )}
    </>
  );

  const DesktopModal = ({ children }) => {
    return (
      <Modal open={modalIsOpen} onClose={handleClose}>
        <ModalDialog
          sx={{
            paddingBottom: "48px",
            paddingRight: "32px",
            paddingLeft: "32px",
            paddingTop: "16px",
            border: "none",
          }}
          className="w-full max-w-lg"
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
      <MobileOverlay name="single-kita-signup" animationDirection="y">
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

export default SingleKitaSignup;
