import React from "react";
import { Kita } from "../../../types";

type KitaListContext = {
  kitas?: Kita[];
  setKitas: (kitas: Kita[]) => void;
  fetchKitas: (latlng: { lat: number; lng: number }) => Promise<void>;
};

const KitaListContext = React.createContext<KitaListContext>(
  {} as KitaListContext
);

type KitaListContextProviderProps = React.PropsWithChildren<{
  kitas?: Kita[];
}>;

const KitaListContextProvider: React.FC<KitaListContextProviderProps> = ({
  kitas: kitasProp = [],
  children,
}) => {
  const [kitas, setKitas] = React.useState<Kita[]>(kitasProp);

  const fetchKitas = async (latlng: { lat: number; lng: number }) => {
    const response = await fetch(
      `/api/kitas?lat=${latlng.lat}&lng=${latlng.lng}`
    );
    const data = await response.json();
    setKitas(data);
  };

  React.useEffect(() => {
    (async () => {
      fetchKitas({ lat: 52.520008, lng: 13.404954 });
    })();
  }, []);

  return (
    <KitaListContext.Provider
      value={{
        kitas,
        setKitas,
        fetchKitas,
      }}
    >
      {children}
    </KitaListContext.Provider>
  );
};

export const useKitaListContext = () => React.useContext(KitaListContext);
export default KitaListContextProvider;
