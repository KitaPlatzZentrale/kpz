import React from "react";
import { DEFAULT_BERLIN_CENTER } from "./defaults";
import { useKitaListContext } from "./KitaDataContext";
import { LatLng } from "./types";

type SearchContext = {
  address: string | null;
  setAddress: (address: string | null) => void;
  coordinates: LatLng | null;
  setCoordinates: (coordinates: LatLng) => void;
  desiredStartingMonth: string | null;
  setDesiredStartingMonth: (desiredStartingMonth: string | null) => void;
  coordinatesAreValid: boolean;
  dirty: boolean;
  submitted: boolean;
  submit: (coordinates?: LatLng) => Promise<void>;
};

const SearchContext = React.createContext<SearchContext>({} as SearchContext);

type SearchContextProviderProps = React.PropsWithChildren<{}>;

const SearchContextProvider: React.FC<SearchContextProviderProps> = ({
  children,
}) => {
  const { fetchKitas } = useKitaListContext();
  const [address, setAddress] = React.useState<string | null>(null);
  const [coordinates, _setCoordinates] = React.useState<LatLng | null>(
    DEFAULT_BERLIN_CENTER
  );

  const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);

  const isDirty = React.useMemo(() => {
    return address !== null || coordinates !== null || hasBeenSubmitted;
  }, [address, coordinates, hasBeenSubmitted]);

  const setCoordinates = React.useCallback(
    (coordinates: LatLng) => {
      _setCoordinates(coordinates);
    },
    [_setCoordinates]
  );

  const submit = async (coordinatesProp?: LatLng) => {
    setHasBeenSubmitted(true);
    const submittingCoordinates = coordinatesProp || coordinates;
    if (!submittingCoordinates) return;

    await handleSubmit(submittingCoordinates);
  };

  const handleSubmit = async (coordinatesProp: LatLng) =>
    await fetchKitas(coordinatesProp);

  const [desiredStartingMonth, setDesiredStartingMonth] = React.useState<
    string | null
  >("August 2023");

  const coordinatesAreValid = React.useMemo(() => {
    return (
      coordinates && coordinates?.lat !== null && coordinates?.lng !== null
    );
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
        dirty: isDirty,
        submitted: hasBeenSubmitted,
        submit,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => React.useContext(SearchContext);
export default SearchContextProvider;
