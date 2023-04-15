import React from "react";

import { CheckCircle } from "@mui/icons-material";
import { Button } from "@mui/joy";

import Balancer from "react-wrap-balancer";
import { useServiceSignupModal } from "../ServiceSignupModalContext";

type ServiceSignupFormSuccessViewProps = {
  // TODO: Add props
};

const ServiceSignupFormSuccessView: React.FC<
  ServiceSignupFormSuccessViewProps
> = () => {
  const { setModalIsOpen } = useServiceSignupModal();
  return (
    <div className="mb-6 flex flex-col items-center justify-center">
      <div className="mb-4">
        <CheckCircle color="info" fontSize="xl7" />
      </div>
      <div className="mb-4 flex flex-col items-center p-2">
        <h3 className="mb-2 text-2xl font-black">Erfolgreich eingereicht.</h3>
        <Balancer className="text-center text-base font-semibold text-gray-500">
          Wir werden Sie schnell per Email benachrichtigen, sobald diese Kita
          wieder Kapazitäten hat.
        </Balancer>
      </div>
      <Button
        fullWidth
        size="lg"
        variant="soft"
        color="neutral"
        onClick={() => setModalIsOpen(false)}
      >
        Schließen
      </Button>
    </div>
  );
};

export default ServiceSignupFormSuccessView;
