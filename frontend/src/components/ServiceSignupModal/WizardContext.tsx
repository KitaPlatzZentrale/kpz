import { ButtonProps } from "@mui/material";
import React from "react";

export type WizardStep = {
  beforeNext?: () => Promise<boolean>;
  beforePrevious?: () => Promise<boolean>;
  onNext?: () => Promise<boolean>;
  onPrevious?: () => void;
  valid: boolean;
  view: React.ReactNode;
};

type WizardContext = {
  activeStepIndex: number;
  steps: WizardStep[];
  setSteps: (steps: WizardStep[]) => void;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  isErrorful: boolean;
  handleComplete: () => Promise<void>;
  isLoading: boolean;
};

export const WizardContext = React.createContext<WizardContext>(
  {} as WizardContext
);

type WizardContextProviderProps = React.PropsWithChildren<{
  steps?: WizardStep[];
  activeStepIndex?: number;
  onComplete?: () => Promise<any>;
}>;

const WizardContextProvider: React.FC<WizardContextProviderProps> = ({
  steps: stepsProps,
  activeStepIndex: activeStepProps = 0,
  onComplete,
  children,
}) => {
  const [activeStepIndex, setActiveStepIndex] =
    React.useState<number>(activeStepProps);
  const [steps, setSteps] = React.useState<WizardStep[]>(stepsProps ?? []);

  const [isErrorful, setIsErrorful] = React.useState<boolean>(
    !steps[activeStepIndex]?.valid
  );

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(
    () => setIsErrorful(!steps[activeStepIndex]?.valid),
    [activeStepIndex, steps]
  );

  React.useEffect(() => stepsProps && setSteps(stepsProps || []), [stepsProps]);

  const goToNext = async () => {
    const currentStep = steps[activeStepIndex];
    if (currentStep.beforeNext) {
      const canGoNext = await currentStep.beforeNext();
      if (canGoNext) {
        const success = await steps[activeStepIndex].onNext?.();
        if (!success) return;

        if (activeStepIndex === steps.length - 1) {
          setIsLoading(true);
          await onComplete?.();
          setIsLoading(false);
        } else {
          setActiveStepIndex(activeStepIndex + 1);
        }
      } else setIsErrorful(true);
    } else {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const goToPrevious = async () => {
    const currentStep = steps[activeStepIndex];
    if (currentStep.beforePrevious) {
      const canGoPrevious = await currentStep.beforePrevious();
      if (canGoPrevious) {
        setActiveStepIndex(activeStepIndex - 1);
      } else setIsErrorful(true);
    } else {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleComplete = async () => {
    await onComplete?.();
  };

  return (
    <WizardContext.Provider
      value={{
        steps,
        setSteps,
        activeStepIndex,
        goToNext,
        goToPrevious,
        isErrorful,
        handleComplete,
        isLoading,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => React.useContext(WizardContext);
export default WizardContextProvider;
