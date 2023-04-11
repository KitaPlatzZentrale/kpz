import React, { ChangeEvent, ChangeEventHandler } from "react";

import { Home } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";

import FormAutocomplete from "../../../components/FormAutocomplete";

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
};

const AddressLookup: React.FC<AddressLookupProps> = ({
  className,
  onAddressSelected,
  onCoordinatesSuccessfullyRetrieved,
  helperText,
  error,
}) => {
  const [input, setInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(
    ""
  );
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
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

      const suggestions =
        responseJson.items?.map((item: any) => item.address?.label || "") ?? [];

      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchCoordinates = async (address: string) => {
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

      const coordinates = responseJson.items?.[0]?.position ?? {};

      setCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
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

  const handleAddressSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSelectedAddress(value);
    onAddressSelected?.(value);
  };

  React.useEffect(() => {
    if (selectedAddress) {
      fetchCoordinates(selectedAddress);
    }
  }, [selectedAddress]);

  React.useEffect(() => {
    onCoordinatesSuccessfullyRetrieved?.(coordinates);
  }, [coordinates]);

  return (
    <FormAutocomplete
      label="Wo wohnen Sie?"
      className={className}
      placeholder="Ihr Wohnort"
      options={suggestions}
      inputProps={{
        freeSolo: true,
        onInputChange: handleInputChange,
        onChange: handleAddressSelection,
        startDecorator: <Home />,
        loading: isLoading,
        loadingText: (
          <span className="flex flex-row items-center gap-3">
            <CircularProgress color="neutral" size="sm" />
            <span className="ml-2">Lade Adressen...</span>
          </span>
        ),
        value: selectedAddress || undefined,
        helperText,
      }}
      error={error}
    />
  );
};

export default AddressLookup;
