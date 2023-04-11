import React from "react";

type ServiceSignupModalContext = {
  modalIsOpen: boolean;
  setModalIsOpen: (open: boolean) => void;
};

const ServiceSignupModalContext =
  React.createContext<ServiceSignupModalContext>(
    {} as ServiceSignupModalContext
  );

type ServiceSignupModalContextProviderProps = React.PropsWithChildren<{
  openOnMount?: boolean;
}>;

const ServiceSignupModalContextProvider: React.FC<
  ServiceSignupModalContextProviderProps
> = ({ openOnMount = false, children }) => {
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(openOnMount);

  return (
    <ServiceSignupModalContext.Provider
      value={{
        modalIsOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </ServiceSignupModalContext.Provider>
  );
};

export const useServiceSignupModal = () =>
  React.useContext(ServiceSignupModalContext);

export default ServiceSignupModalContextProvider;
