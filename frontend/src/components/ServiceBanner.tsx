import { Button } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import { useMobileOverlay } from "./MobileOverlay/MobileOverlayContext";

type ServiceBannerProps = {
  open?: boolean;
  className?: string;
};

const ServiceBanner: React.FC<ServiceBannerProps> = ({ open, className }) => {
  const [bannerIsOpen, setBannerIsOpen] = React.useState(open ?? true);

  const { isOpen: isMobileOverlayOpen, setOpen: setMobileOverlayOpen } =
    useMobileOverlay("service-signup");

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
      <div className="flex w-full flex-col justify-between gap-8 2xl:flex-row 2xl:items-center 2xl:gap-12">
        <div className="flex flex-col items-center gap-8 2xl:flex-row 2xl:items-start 2xl:gap-8">
          <div className="mt-2">
            <img
              src="/illustrations/service-finder.svg"
              className="h-full w-full object-cover"
              alt="Finder"
            />
          </div>
          <div className="flex flex-col items-center gap-6 2xl:items-start 2xl:gap-2">
            <div className="flex flex-col gap-0">
              <h4 className="m-0 text-center text-xl font-black 2xl:text-start">
                Auf Kita-Suche?
              </h4>
              <h4 className="m-0 text-center text-xl font-black text-happy-blue 2xl:text-start">
                Wir sind für dich da.
              </h4>
            </div>
            <p className="font-semibold">
              <p className="text-center 2xl:text-start">
                Unser PlatzFinder Service nimmt den Stress aus Ihrem
                Elternalltag. Ganz unverbindlich —{" "}
                <p className="font-extrabold">Sie bezahlen nur bei Erfolg.</p>
              </p>
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse justify-stretch gap-4 2xl:flex-row 2xl:items-center 2xl:self-center">
          <Button
            color="primary"
            variant="solid"
            onClick={() => setMobileOverlayOpen(true)}
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
