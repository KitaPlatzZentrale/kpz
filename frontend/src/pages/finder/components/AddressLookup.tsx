import React from "react";

import { Home, LocationOn } from "@mui/icons-material";
import { AutocompleteProps, CircularProgress, Link } from "@mui/joy";

import FormAutocomplete from "../../../components/FormAutocomplete";
import clsx from "clsx";
import useGeolocation from "react-hook-geolocation";

const IDLE_TYPING_TIME_BEFORE_FETCHING_SUGGESTIONS = 200;

type AddressLookupProps = {
  className?: string;
  onAddressSelected?: (address: string | null) => void;
  onCoordinatesSuccessfullyRetrieved?: (coordinates: {
    lat: number | null;
    lng: number | null;
  }) => void;
  helperText?: string;
  error?: boolean;
  hideCurrentLocationOption?: boolean;
} & AutocompleteProps<any, false, false, false>;

const AddressLookup: React.FC<AddressLookupProps> = ({
  className,
  onAddressSelected,
  onCoordinatesSuccessfullyRetrieved,
  helperText,
  error,
  hideCurrentLocationOption,
  ...autoCompleteProps
}) => {
  const [allowUserCoordinatesRequest, setAllowUserCoordinatesRequest] =
    React.useState<boolean | null>(null);

  const [currentUserPosition, setCurrentUserPosition] = React.useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  const [input, setInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(
    ""
  );
  const [coordinates, setCoordinates] = React.useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const currentCoordinatesAreUserCoordinates =
    currentUserPosition &&
    currentUserPosition.latitude &&
    currentUserPosition.longitude &&
    coordinates.lat === currentUserPosition.latitude &&
    coordinates.lng === currentUserPosition.longitude;

  const [hasFetchingError, setHasFetchingError] = React.useState(false);
  const [isLoadingUserLocation, setIsLoadingUserLocation] =
    React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
    setHasFetchingError(false);
    try {
      const response = await fetch(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${query}&lang=de&limit=5&apikey=${
          import.meta.env.VITE_PUBLIC_HERE_API_KEY
        }`,
        {
          method: "GET",
        }
      );

      const responseJson = await response.json();

      if (!responseJson.items) {
        setHasFetchingError(true);
        return;
      }

      const suggestions =
        responseJson.items?.map((item: any) => item.address?.label || "") ?? [];

      setSuggestions(suggestions);
    } catch (error) {
      setHasFetchingError(true);
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchAddressByLatLng = async (lat: number, lng: number) => {
    setHasFetchingError(false);

    try {
      const response = await fetch(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&lang=de&apikey=${
          import.meta.env.VITE_PUBLIC_HERE_API_KEY
        }`,
        {
          method: "GET",
        }
      );

      const responseJson = await response.json();

      if (!responseJson.items) {
        throw Error("No property items found on response");
      }

      const address = responseJson.items?.[0]?.title ?? "";

      return address;
    } catch (error) {
      console.error("Error fetching address:", error);
      setHasFetchingError(true);
    }
  };

  const fetchCoordinates = async (address: string) => {
    setHasFetchingError(false);
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apikey=${
          import.meta.env.VITE_PUBLIC_HERE_API_KEY
        }`,
        {
          method: "GET",
        }
      );

      const responseJson = await response.json();

      if (!responseJson.items) {
        setHasFetchingError(true);
        return;
      }

      const coordinates = responseJson.items?.[0]?.position ?? {};
      setCoordinates(coordinates);
    } catch (error) {
      setHasFetchingError(true);
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleInputChange = (e) => {
    if (!e) return;

    const value = e?.target.value;
    setInput(value);

    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(async () => {
        if (value?.length > 3) {
          setIsLoading(true);
          await fetchSuggestions(value);
          setIsLoading(false);
        } else {
          setSuggestions([]);
        }
      }, IDLE_TYPING_TIME_BEFORE_FETCHING_SUGGESTIONS)
    );
  };

  const handleAddressSelection = (value: string | null) => {
    setInput(value || "");
    setSelectedAddress(value);
    onAddressSelected?.(value);
  };

  const handleUserLocationChange = async (
    geolocation: GeolocationCoordinates
  ) => {
    if (!allowUserCoordinatesRequest) return;
    if (currentCoordinatesAreUserCoordinates) return;

    const { latitude, longitude, accuracy: accuracyInMeters } = geolocation;

    //TODO: Give user visual feedback that an accurate position wasn't accessible in the current network settings.
    // if accuracyInMeters is bigger than 50 meters.
    // Tested this on home wifi, got accuracy of 5000 meters (???), with hotspot wifi from phone with GPS the accuracy was 14 meters.

    setIsLoadingUserLocation(true);

    setCoordinates({
      lat: latitude,
      lng: longitude,
    });
    setCurrentUserPosition({
      latitude,
      longitude,
    });

    const addressDescription = await fetchAddressByLatLng(latitude, longitude);

    if (addressDescription.length > 0) {
      setInput(addressDescription);
      setSelectedAddress(addressDescription);
    } else {
      setInput("Momentane Adresse");
    }
    setIsLoadingUserLocation(false);

    setAllowUserCoordinatesRequest(false);
  };

  const { latitude, longitude } = useGeolocation(
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
    handleUserLocationChange,
    !!allowUserCoordinatesRequest
  );

  React.useEffect(() => {
    if (!selectedAddress) {
      setCoordinates({ lat: null, lng: null });
    }
    selectedAddress && fetchCoordinates(selectedAddress);
  }, [selectedAddress]);

  React.useEffect(() => {
    onCoordinatesSuccessfullyRetrieved?.(coordinates);
  }, [coordinates]);

  return (
    <div className={clsx("flex flex-col", className)}>
      <FormAutocomplete
        label="Wo wohnen Sie?"
        placeholder="Ihr Wohnort"
        options={suggestions}
        onChange={(e, value) => handleAddressSelection(value)}
        onInputChange={handleInputChange}
        inputValue={input}
        loading={isLoading}
        loadingText={
          <span className="flex flex-row items-center gap-3">
            <CircularProgress color="neutral" size="sm" />
            <span className="ml-2">Lade Adressen...</span>
          </span>
        }
        value={selectedAddress || undefined}
        noOptionsText="Keine Adressen gefunden"
        startDecorator={<Home />}
        inputProps={{
          error: hasFetchingError || error,
          helperText: hasFetchingError
            ? "Fehler beim Abrufen der Adresse"
            : helperText,
        }}
        {...autoCompleteProps}
      />
      {!hideCurrentLocationOption && (
        <Link
          component="button"
          mt={1}
          color="info"
          fontWeight={"bold"}
          fontSize="sm"
          underline="always"
          disabled={
            currentCoordinatesAreUserCoordinates &&
            allowUserCoordinatesRequest === false
          }
          startDecorator={
            isLoadingUserLocation ? (
              <CircularProgress color="info" size="sm" />
            ) : (
              <LocationOn />
            )
          }
          onClick={() => setAllowUserCoordinatesRequest(true)}
        >
          Momentane Position nutzen
        </Link>
      )}
    </div>
  );
};

export default AddressLookup;
