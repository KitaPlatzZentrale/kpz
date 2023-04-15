import { Button } from "@mui/joy";
import React from "react";

import Balancer from "react-wrap-balancer";
import { useServiceSignupModal } from "../../../components/ServiceSignupModal/ServiceSignupModalContext";

type ServiceBannerProps = {
  open?: boolean;
};

const ServiceBanner: React.FC<ServiceBannerProps> = ({ open }) => {
  const { modalIsOpen, setModalIsOpen } = useServiceSignupModal();

  return (
    <div className="relative flex w-full items-center justify-center bg-white p-8">
      <div className="flex w-full max-w-5xl flex-row items-center justify-between">
        <div className="flex  flex-row gap-5">
          <div className="mt-2">
            <img src="/illustrations/service-finder.svg" alt="Finder" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-0">
              <h4 className="m-0 text-xl font-black">Auf Kita-Suche?</h4>
              <h4 className="m-0 text-xl font-black text-happy-blue">
                Wir sind für dich da.
              </h4>
            </div>
            <p className="font-semibold">
              <Balancer>
                Unser PlatzFinder Service nimmt den Stress aus Ihrem
                Elternalltag. Ganz unverbindlich —{" "}
                <strong className="font-extrabold">
                  Sie bezahlen nur bei Erfolg.
                </strong>
              </Balancer>
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Button
            color="primary"
            variant="plain"
            onClick={() => setModalIsOpen(true)}
          >
            <span className="underline underline-offset-1">Mehr erfahren</span>
          </Button>
          <Button
            color="primary"
            variant="solid"
            onClick={() => setModalIsOpen(true)}
          >
            Jetzt anfragen
          </Button>
        </div>
      </div>
      <div id="closing-x-icon" className="absolute right-16 top-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

export default ServiceBanner;
