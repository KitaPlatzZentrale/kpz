import { Button, ModalClose } from "@mui/joy";
import React from "react";

import Balancer from "react-wrap-balancer";
import { useServiceSignupModal } from "../../../components/ServiceSignupModal/ServiceSignupModalContext";

type ServiceBannerProps = {
  open?: boolean;
};

const ServiceBanner: React.FC<ServiceBannerProps> = ({ open }) => {
  const [bannerIsOpen, setBannerIsOpen] = React.useState(open ?? true);

  const { modalIsOpen, setModalIsOpen } = useServiceSignupModal();

  const handleBannerClose = () => {
    setBannerIsOpen(false);
  };

  return bannerIsOpen ? (
    <div className="relative flex w-full items-center justify-center rounded-2xl bg-white px-8 py-8 shadow-lg shadow-gray-200 lg:px-12">
      <div className="flex w-full flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-0">
        <div className="flex flex-row gap-5">
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
        <div className="flex flex-row items-center gap-4 self-end lg:self-center">
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
      <ModalClose
        sx={{ marginRight: "4px", marginTop: "4px" }}
        onClick={handleBannerClose}
      />
    </div>
  ) : null;
};

export default ServiceBanner;
