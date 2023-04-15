import React from "react";

import { ArrowForward } from "@mui/icons-material";
import { Button, Link } from "@mui/joy";

import Balancer from "react-wrap-balancer";
import { useWizardContext } from "../WizardContext";

type ServiceSignupIntroViewProps = {};

const ServiceSignupIntroView: React.FC<ServiceSignupIntroViewProps> = () => {
  const { goToNext } = useWizardContext();

  return (
    <div className="flex flex-col items-center justify-center">
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
      <div className="my-10 flex flex-row justify-center gap-6 px-4">
        <div className="flex w-32 flex-col  gap-2 px-2">
          <img
            src="/illustrations/service-modal-feat1.svg"
            alt="Maßgeschneiderte Kita-Suche mit eigenen Präferenzen"
          />
          <span className="text-center font-medium">
            Finde eine Kita nach deinen Präferenzen
          </span>
        </div>
        <div className="flex w-32 flex-col gap-2 px-2">
          <img
            src="/illustrations/service-modal-feat2.svg"
            alt="Maßgeschneiderte Kita-Suche mit eigenen Präferenzen"
          />
          <span className="w-full text-center font-medium">
            Erhalte Berichte direkt via Email
          </span>
        </div>

        <div className="flex w-32 flex-col gap-2 px-2">
          <img
            src="/illustrations/service-modal-feat3.svg"
            alt="Maßgeschneiderte Kita-Suche mit eigenen Präferenzen"
          />
          <span className="w-full text-center font-medium">
            Zahle <strong>nur bei erfolgreicher Vermittlung</strong>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <Button
          endDecorator={<ArrowForward sx={{ fontSize: 24 }} />}
          size="lg"
          variant="solid"
          color="primary"
          onClick={goToNext}
        >
          Kostenlos anmelden
        </Button>
        <span className="w-full text-center text-sm text-gray-400">
          There is no commitment or credit card required. A Kitaplatz is not
          guaranteed. <br />
          <Link className="text-sm font-bold" href="">
            Learn more
          </Link>{" "}
          about KitaPlatzZentrale.
        </span>
      </div>
    </div>
  );
};

export default ServiceSignupIntroView;
