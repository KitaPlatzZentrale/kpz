import React from "react";
import { useServiceSignupFormContext } from "./ServiceSignupFormContext";
import ServiceSignupFormView from "./views/ServiceSignupFormView";
import ServiceSignupIntroView from "./views/ServiceSignupIntroView";
import { useWizardContext } from "./WizardContext";

const Wizard: React.FC = () => {
  const { activeStepIndex, steps, setSteps } = useWizardContext();

  const {
    isValid: serviceFormIsValid,
    validate: serviceFormValidate,
    handleSubmit: handleServiceFormSubmit,
  } = useServiceSignupFormContext();

  React.useEffect(() => {
    setSteps([
      {
        view: <ServiceSignupIntroView />,
        valid: true,
      },
      {
        view: <ServiceSignupFormView />,
        valid: serviceFormIsValid,
        beforeNext: async () => {
          const valid = await serviceFormValidate();
          return valid;
        },
        onNext: async () => {
          await handleServiceFormSubmit();
        },
      },
    ]);
  }, []);

  React.useEffect(() => console.log(steps), [steps]);

  return <>{steps[activeStepIndex]?.view ?? <div></div>}</>;
};

export default Wizard;
