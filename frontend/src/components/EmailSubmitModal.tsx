import { Button, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React from "react";

import Balancer from "react-wrap-balancer";
import FormField from "./FormField";

type EmailSubmitModalProps = {
  open?: boolean;
};

const EmailSubmitModal: React.FC<EmailSubmitModalProps> = ({
  open = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(open);

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <ModalDialog
        sx={{
          paddingBottom: "48px",
          paddingRight: "32px",
          paddingLeft: "32px",
          paddingTop: "16px",
        }}
        className="w-full max-w-lg"
      >
        <div className="mb-4 flex flex-row-reverse">
          <ModalClose
            sx={{ position: "relative", top: 0, right: "-16px" }}
            onClick={() => setIsOpen(false)}
          />
        </div>

        <div className="mb-8 w-full">
          <h3 className="mb-2 text-xl font-black">Email Benachrichtigungen</h3>
          <Balancer>
            <p className="text-base">
              Wir werden Sie schnell per Email benachrichtigen, sobald diese
              Kita wieder Kapazitäten hat.
            </p>
          </Balancer>
        </div>
        <div className="w-full">
          <FormField label="Email Adresse" placeholder="Ihre Email Adresse" />
        </div>
        <div className="mt-8 flex w-full flex-row-reverse">
          <Button variant="solid" size="md" color="primary">
            Benachrichtigen lassen
          </Button>
        </div>
      </ModalDialog>
    </Modal>
  );
};

export default EmailSubmitModal;
