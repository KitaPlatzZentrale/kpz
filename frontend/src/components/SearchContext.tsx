import React from "react";

type LatLng = {
  lat: number | null;
  lng: number | null;
};

type SearchContext = {
  address: string | null;
  setAddress: (address: string | null) => void;
  coordinates: LatLng;
  setCoordinates: (coordinates: {
    lat: number | null;
    lng: number | null;
  }) => void;
  desiredStartingMonth: string | null;
  setDesiredStartingMonth: (desiredStartingMonth: string | null) => void;
  coordinatesAreValid: boolean;
};

const SearchContext = React.createContext<SearchContext>({} as SearchContext);

type SearchContextProviderProps = React.PropsWithChildren<{}>;

const SearchContextProvider: React.FC<SearchContextProviderProps> = ({
  children,
}) => {
  const [address, setAddress] = React.useState<string | null>(null);
  const [coordinates, setCoordinates] = React.useState<LatLng>({
    lat: null,
    lng: null,
  });

  const [desiredStartingMonth, setDesiredStartingMonth] = React.useState<
    string | null
  >("August 2023");

  const coordinatesAreValid = React.useMemo(() => {
    return coordinates.lat !== null && coordinates.lng !== null;
  }, [coordinates]);

  return (
    <SearchContext.Provider
      value={{
        address,
        setAddress,
        coordinates,
        setCoordinates,
        desiredStartingMonth,
        setDesiredStartingMonth,
        coordinatesAreValid,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => React.useContext(SearchContext);
export default SearchContextProvider;
