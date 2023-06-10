import React from "react";

import { ArrowForward } from "@mui/icons-material";
import { Button, Link } from "@mui/joy";

import Balancer from "react-wrap-balancer";
import { useWizardContext } from "../WizardContext";

type ServiceSignupIntroViewProps = {};

const ServiceSignupIntroView: React.FC<ServiceSignupIntroViewProps> = () => {
  const { goToNext } = useWizardContext();

  return (
    <div className="flex h-full flex-col items-center lg:h-fit lg:justify-center">
      <div className="flex flex-col items-center p-2">
        <h3 className="mb-8 text-center text-3xl font-black">
          Auf Kita-Suche?
          <br />
          <span className="text-happy-blue">Wir sind hier für dich.</span>
        </h3>
        <Balancer className="text-center text-base font-semibold text-gray-500">
          Wir wissen wie stressgeladen die Suche nach einer Kita sein kann.
          Überlass' uns die Fleißarbeit - wir finden die passende Kita für dich.
        </Balancer>
      </div>
      <div className="my-10 flex flex-col justify-center gap-4 px-0 lg:flex-row lg:gap-6">
        <div className="flex w-full flex-row items-center gap-4 px-2 lg:w-32 lg:flex-col lg:gap-2">
          <img
            src="/illustrations/service-modal-feat1.svg"
            className="w-16 lg:w-full"
            alt="Maßgeschneiderte Kita-Suche mit eigenen Präferenzen"
          />
          <span className="font-medium lg:text-center">
            Finde eine Kita nach deinen Präferenzen
          </span>
        </div>
        <div className="flex w-full flex-row items-center gap-4 px-2 lg:w-32 lg:flex-col lg:gap-2">
          <img
            src="/illustrations/service-modal-feat2.svg"
            className="w-16 lg:w-full"
            alt="Maßgeschneiderte Kita-Suche mit eigenen Präferenzen"
          />
          <span className="w-full font-medium lg:text-center">
            Erhalte Berichte direkt via Email
          </span>
        </div>

        <div className="flex w-full flex-row items-center gap-4 px-2 lg:w-32 lg:flex-col lg:gap-2">
          <img
            src="/illustrations/service-modal-feat3.svg"
            className="w-16 lg:w-full"
            alt="Maßgeschneiderte Kita-Suche mit eigenen Präferenzen"
          />
          <span className="w-full font-medium lg:text-center">
            Zahle <strong>nur bei erfolgreicher Vermittlung</strong>
          </span>
        </div>
      </div>
      <div className="mb-8 flex flex-col items-center justify-center">
        <Button
          endDecorator={<ArrowForward sx={{ fontSize: 24 }} />}
          size="lg"
          variant="solid"
          color="primary"
          onClick={goToNext}
        >
          Kostenlos anmelden
        </Button>
      </div>
      <span className="mb-6 mt-auto w-full text-center text-sm text-gray-400 lg:mt-0">
        Ein unverbindliches Angebot. Ein Kitaplatz ist nicht garantiert. <br />
        <Link className="text-sm font-bold" fontSize={"0.875rem"} href="">
          Lerne mehr
        </Link>{" "}
        über KitaPlatzZentrale.
      </span>
    </div>
  );
};

export default ServiceSignupIntroView;
