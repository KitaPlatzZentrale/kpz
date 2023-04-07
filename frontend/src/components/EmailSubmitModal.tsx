import { CheckCircle, MailOutline } from "@mui/icons-material";
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy";
import React from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";

import Balancer from "react-wrap-balancer";
import FormField from "./FormField";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormFields = {
  email: string;
  name: string;
  interneKitaId: number;
  kitaName: string;
};

const validation = Yup.object().shape({
  email: Yup.string()
    .email("Bitte geben Sie eine gültige Email Adresse ein.")
    .required("Bitte geben Sie eine Email Adresse ein."),
});

type EmailSubmitModalProps = {
  open: boolean;
  onClose?: () => void;
};

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

const EmailSubmitModal: React.FC<EmailSubmitModalProps> = ({
  open = false,
  onClose,
}) => {
  const {
    register: _register,
    handleSubmit,
    getFieldState,
    formState,
  } = useForm<FormFields>({
    defaultValues: {
      email: "hannogrimm@gmail.com",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(validation),
  });

  const register = (fieldName: Path<FormFields>) => {
    const { error, invalid } = getFieldState(fieldName, formState);

    const { ref, ...rest } = _register(fieldName);

    return {
      ...rest,
      ref,
      inputRef: ref,
      helperText: error?.message,
      error: invalid,
    };
  };

  const onSubmit: SubmitHandler<FormFields> = async (fields) => {
    setIsLoading(true);
    submitEmailAction(fields.email)
      .then((success) => {
        setIsLoading(false);
        success && setWasSuccessfullySubmitted(true);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };
  const [isLoading, setIsLoading] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(open);
  const [wasSuccessfullySubmitted, setWasSuccessfullySubmitted] =
    React.useState(false);

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
            onClick={() => setIsOpen(false)}
          />
        </div>

        {!wasSuccessfullySubmitted ? (
          <>
            <div className="mb-8 w-full">
              <h3 className="mb-2 text-xl font-black">
                Email Benachrichtigungen
              </h3>
              <Balancer>
                <p className="text-base">
                  Wir werden Sie schnell per Email benachrichtigen, sobald diese
                  Kita wieder Kapazitäten hat.
                </p>
              </Balancer>
            </div>
            <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full">
                <FormField
                  inputProps={{
                    startDecorator: <MailOutline />,
                    ...register("email"),
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
                >
                  Benachrichtigen lassen
                </Button>
              </div>
            </form>
          </>
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
      </ModalDialog>
    </Modal>
  );
};

export default EmailSubmitModal;
