import React from "react";
import type { Kita, PaginatedResultsResponse } from "../../../types";

type LoaderParams = {
  lat: number;
  lng: number;
  distanceInMeters?: number;
  page?: number;
  limit?: number;
};

const loader = async ({
  lat,
  lng,
  distanceInMeters = 1500,
  page = 1,
  limit = 500,
}: LoaderParams) => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/location-service`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: distanceInMeters.toString(),
        page: page.toString(),
        limit: limit.toString(),
      }),
    }
  );

  const data: PaginatedResultsResponse<Kita> = await response.json();

  //TODO: handle error
  if (!data || !data.items) return null;

  return data.items;
};

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

  const fetchKitas = async (latlng: { lat: number; lng: number }) => {
    setIsFetching(true);
    setKitas(null);

    //TODO: Review impact, experimental instant-delay to allow animations to fade out before fetching
    setTimeout(async () => {
      const foundKitas = await loader({ ...latlng });
      setKitas(foundKitas);
      setIsFetching(false);
    }, 0);
  };

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
