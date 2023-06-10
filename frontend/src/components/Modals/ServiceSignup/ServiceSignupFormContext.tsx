import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Control,
  FormState,
  Path,
  RefCallBack,
  useForm,
  UseFormRegisterReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import * as Yup from "yup";

type FormFields = {
  fullAddress: string | null;
  desiredStartMonth: string | null;
  expectedBirthDate: string | null;
  email: string;
};
type FormFieldsReference = Path<FormFields>;

export type UseRegisterReturn = UseFormRegisterReturn & {
  defaultValue: string | null;
  inputRef: RefCallBack;
  helperText?: string;
  error?: boolean;
};

export type UseRegister<FormFieldsReference> = (
  fieldName: FormFieldsReference
) => UseRegisterReturn;

const validation = Yup.object().shape({
  fullAddress: Yup.string().required(
    "Bitte geben Sie die Adresse Ihres Wohnortes ein."
  ),
  desiredStartMonth: Yup.string().required(
    "Bitte geben Sie den gewünschten Beginn an."
  ),
  expectedBirthDate: Yup.string().required(
    "Bitte geben Sie das (erwartete) Geburtsdatum Ihres Kindes an."
  ),
  email: Yup.string()
    .email("Bitte geben Sie eine gültige Email Adresse ein.")
    .required("Bitte geben Sie eine Email Adresse ein."),
});

type ServiceSignupFormContext = {
  register: UseRegister<FormFieldsReference>;
  control: Control<FormFields>;
  formState: FormState<FormFields>;
  watch: UseFormWatch<FormFields>;
  validate: (name?: FormFieldsReference) => Promise<boolean>;
  setValue: UseFormSetValue<FormFields>;
  handleSubmit: () => Promise<boolean>;
  isValid: boolean;
  isLoading: boolean;
};

const ServiceSignupFormContext = React.createContext<ServiceSignupFormContext>(
  {} as ServiceSignupFormContext
);

type ServiceSignupFormContextProviderProps = React.PropsWithChildren<{
  onSubmit?: (data: FormFields) => Promise<boolean>;
}>;

const ServiceSignupFormContextProvider: React.FC<
  ServiceSignupFormContextProviderProps
> = ({ children, onSubmit: onSubmitProp }) => {
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register: _register,
    handleSubmit: _handleSubmit,
    getFieldState,
    formState,
    control,
    watch,
    trigger,
    setValue,
  } = useForm<FormFields>({
    mode: "onChange",
    reValidateMode: "onChange",

    resolver: yupResolver(validation),
  });

  const register = (fieldName: Path<FormFields>) => {
    const { error, invalid } = getFieldState(fieldName, formState);

    const { ref, ...rest } = _register(fieldName);

    const value = watch(fieldName);

    return {
      ...rest,
      ref,
      defaultValue: value,
      inputRef: ref,
      helperText: error?.message,
      error: invalid,
    };
  };

  const validate = async (fieldName?: FormFieldsReference) => {
    const valid = await trigger(fieldName);

    // if global form validation has been triggered, set attemptedSubmit to true
    if (!fieldName) {
      setAttemptedSubmit(true);
    }

    return valid;
  };

  const isValid = React.useMemo(() => {
    if (!attemptedSubmit) return true;
    return formState.isValid;
  }, [attemptedSubmit, formState.isValid]);

  const onSubmit = async (data: any) => {
    setAttemptedSubmit(true);
    return await onSubmitProp?.(data);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    return _handleSubmit(
      async (data) => await onSubmit(data),
      (errors) => {
        console.log(errors);
      }
    )()
      .then(() => {
        setIsLoading(false);
        return true;
      })
      .catch(() => {
        setIsLoading(false);
        return false;
      });
  };

  return (
    <ServiceSignupFormContext.Provider
      value={{
        register,
        control,
        formState,
        watch,
        validate,
        setValue,
        handleSubmit,
        isValid,
        isLoading,
      }}
    >
      {children}
    </ServiceSignupFormContext.Provider>
  );
};

export const useServiceSignupFormContext = () =>
  React.useContext(ServiceSignupFormContext);

export default ServiceSignupFormContextProvider;
