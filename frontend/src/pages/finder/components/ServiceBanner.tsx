import { Button, ModalClose } from "@mui/joy";
import clsx from "clsx";
import React from "react";

import Balancer from "react-wrap-balancer";
import { useServiceSignupModal } from "../../../components/ServiceSignupModal/ServiceSignupModalContext";

type ServiceBannerProps = {
  open?: boolean;
  className?: string;
};

const ServiceBanner: React.FC<ServiceBannerProps> = ({ open, className }) => {
  const [bannerIsOpen, setBannerIsOpen] = React.useState(open ?? true);

  const { modalIsOpen, setModalIsOpen } = useServiceSignupModal();

  const handleBannerClose = () => {
    setBannerIsOpen(false);
  };

  return bannerIsOpen ? (
    <div
      className={clsx(
        "relative flex w-full items-center justify-center rounded-2xl bg-white px-8 py-8 lg:px-12 lg:pr-6",
        className
      )}
    >
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-8">
          <div className="mt-2">
            <img src="/illustrations/service-finder.svg" alt="Finder" />
          </div>
          <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-2">
            <div className="flex flex-col gap-0">
              <h4 className="m-0 text-center text-xl font-black lg:text-start">
                Auf Kita-Suche?
              </h4>
              <h4 className="m-0 text-center text-xl font-black text-happy-blue lg:text-start">
                Wir sind für dich da.
              </h4>
            </div>
            <p className="font-semibold">
              <Balancer className="text-center lg:text-start">
                Unser PlatzFinder Service nimmt den Stress aus Ihrem
                Elternalltag. Ganz unverbindlich —{" "}
                <Balancer className="font-extrabold">
                  Sie bezahlen nur bei Erfolg.
                </Balancer>
              </Balancer>
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-stretch gap-4 lg:flex-row lg:items-center lg:self-end lg:self-center">
          <Button
            color="primary"
            variant="plain"
            onClick={() => setModalIsOpen(true)}
            size="lg"
          >
            <span className="underline underline-offset-1">Mehr erfahren</span>
          </Button>
          <Button
            color="primary"
            variant="solid"
            onClick={() => setModalIsOpen(true)}
            size="lg"
          >
            Jetzt anfragen
          </Button>
        </div>
      </div>
      {/*<ModalClose
        sx={{ marginRight: "4px", marginTop: "4px" }}
        onClick={handleBannerClose}
  />*/}
    </div>
  ) : null;
};

export default ServiceBanner;
