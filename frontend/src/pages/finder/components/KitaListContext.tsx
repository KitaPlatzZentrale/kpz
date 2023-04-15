import React from "react";
import { Kita } from "../../../types";

type KitaListContext = {
  kitas: Kita[] | null;
  setKitas: (kitas: Kita[]) => void;
  fetchKitas: (latlng: { lat: number; lng: number }) => Promise<void>;
  isFetching: boolean;
};

const KitaListContext = React.createContext<KitaListContext>(
  {} as KitaListContext
);

type KitaListContextProviderProps = React.PropsWithChildren<{
  kitas?: Kita[];
}>;

const KitaListContextProvider: React.FC<KitaListContextProviderProps> = ({
  kitas: kitasProp = null,
  children,
}) => {
  const [kitas, setKitas] = React.useState<Kita[] | null>(kitasProp);

  const [isFetching, setIsFetching] = React.useState(false);
  const _fetchKitas = async (latlng: { lat: number; lng: number }) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/location-service/${latlng.lat}/${
        latlng.lng
      }/2.5`,
      {
        method: "GET",
      }
    );
    const data = await response.json();

    const kitas = (data as Array<Kita>)
      .sort((a, b) => a.coordinates.dist - b.coordinates.dist)
      .slice(0, 30);

    setKitas(kitas);
  };

  const fetchKitas = async (latlng: { lat: number; lng: number }) => {
    setIsFetching(true);
    setKitas(null);
    await _fetchKitas(latlng);
    setIsFetching(false);
  };

  React.useEffect(() => {
    (async () => {
      await _fetchKitas({ lat: 52.516, lng: 13.377 });
    })();
  }, []);

  return (
    <KitaListContext.Provider
      value={{
        kitas,
        setKitas,
        fetchKitas,
        isFetching,
      }}
    >
      {children}
    </KitaListContext.Provider>
  );
};

export const useKitaListContext = () => React.useContext(KitaListContext);
export default KitaListContextProvider;
