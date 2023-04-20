import React from "react";
import { Kita, PaginatedResultsResponse } from "../../../types";
import { DEFAULT_BERLIN_CENTER } from "../SearchContext";

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
  const _fetchKitas = async (
    latlng: { lat: number; lng: number },
    distanceInKm: number = 2500,
    page: number = 1,
    limit: number = 50
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/location-service/${latlng.lat}/${
        latlng.lng
      }/${distanceInKm}/${page}/${limit}`,
      {
        method: "GET",
      }
    );
    const data = (await response.json()) as PaginatedResultsResponse<Kita>;

    if (!data) {
      //TODO: Error handling
      return;
    }

    const paginationMeta = data.meta;

    setKitas((prev) => {
      if (page === 1) return data.items || null;
      else return [...(prev || []), ...data.items];
    });

    // if paginationMeta.nextPage is null, we have reached the end of the list
    // otherwise, paginationMeta.nextPage is the number of the next page
    if (!!paginationMeta.nextPage) {
      //await _fetchKitas(latlng, distanceInKm, paginationMeta.nextPage, limit);
    }
  };

  const fetchKitas = async (latlng: { lat: number; lng: number }) => {
    setIsFetching(true);
    setKitas(null);
    await _fetchKitas(latlng);
    setIsFetching(false);
  };

  React.useEffect(() => {
    (async () => {
      await _fetchKitas(DEFAULT_BERLIN_CENTER);
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
