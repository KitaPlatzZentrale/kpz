import React from "react";

type MobileOverlayContext = {
  isOpen: (id: string) => boolean;
  setOpen: (id: string, open: boolean) => void;
  register: (id: string) => void;
  z: (id: string) => number;
};

const MobileOverlayContext = React.createContext<MobileOverlayContext>(
  {} as MobileOverlayContext
);

type MobileOverlayContextProviderProps = React.PropsWithChildren<{}>;

const MobileOverlayContextProvider: React.FC<
  MobileOverlayContextProviderProps
> = ({ children }) => {
  const [overlays, setOverlays] = React.useState<string[]>([]);

  const register = (id: string) => {
    if (isOpen(id)) return;
    setOverlays((prev) => [...prev, id]);

    document.body.style.overflowY = "hidden";
  };

  const unregister = (id: string) => {
    setOverlays((prev) => prev.filter((item) => item !== id));

    if (overlays.length === 0) {
      document.body.style.overflowY = "auto";
    }
  };

  const isOpen = (id: string) => {
    return overlays.includes(id);
  };

  const setOpen = (id: string, open: boolean) => {
    open ? register(id) : unregister(id);
  };

  const z = (id: string) => overlays.findIndex((item) => item === id) + 1;

  return (
    <MobileOverlayContext.Provider
      value={{
        isOpen,
        setOpen,
        register,
        z,
      }}
    >
      {children}
    </MobileOverlayContext.Provider>
  );
};

export const useMobileOverlay = (id?: string) => {
  const ctx = React.useContext(MobileOverlayContext);

  if (!ctx) {
    throw new Error(
      "useMobileOverlay must be used within a MobileOverlayContextProvider"
    );
  }

  if (id) {
    return {
      isOpen: ctx.isOpen(id),
      setOpen: (open: boolean) => ctx.setOpen(id, open),
      z: ctx.z(id),
    };
  }

  return ctx;
};
export default MobileOverlayContextProvider;
