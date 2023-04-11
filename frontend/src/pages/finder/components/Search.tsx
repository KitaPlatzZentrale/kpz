import { DateRange } from "@mui/icons-material";
import { Button } from "@mui/joy";
import React from "react";
import FormAutocomplete from "../../../components/FormAutocomplete";
import { useSearchContext } from "../../../components/SearchContext";
import AddressLookup from "./AddressLookup";
import { useKitaListContext } from "./KitaListContext";

type SearchProps = {};

const Search: React.FC<SearchProps> = ({}) => {
  const {
    setCoordinates,
    setAddress,
    coordinates,
    address,
    desiredStartingMonth,
    setDesiredStartingMonth,
    coordinatesAreValid,
  } = useSearchContext();

  const { fetchKitas, isFetching } = useKitaListContext();

  return (
    <div className="w-full bg-sunny-light px-24 pb-8 pt-10">
      <div className="flex w-full max-w-5xl flex-row items-end gap-6">
        <AddressLookup
          onAddressSelected={(address) => {
            setAddress(address);
          }}
          onCoordinatesSuccessfullyRetrieved={(coordinates) => {
            console.log(coordinates);
            setCoordinates(coordinates);
          }}
        />
        <FormAutocomplete
          formControlProps={{
            className: "w-1/4",
          }}
          label="Gewünschter Beginn"
          placeholder="z.B. Mai 2023"
          inputProps={{
            startDecorator: <DateRange />,
          }}
          value={desiredStartingMonth}
          options={[
            "Mai 2023",
            "Juni 2023",
            "Juli 2023",
            "August 2023",
            "September 2023",
            "Oktober 2023",
            "November 2023",
            "Dezember 2023",
            "Januar 2024",
            "Februar 2024",
            "März 2024",
            "April 2024",
            "Mai 2024",
            "Juni 2024",
            "Juli 2024",
            "August 2024",
            "September 2024",
            "Oktober 2024",
            "November 2024",
            "Dezember 2024",
            "Januar 2025",
            "Februar 2025",
            "März 2025",
            "April 2025",
          ]}
          defaultValue={desiredStartingMonth}
          onChange={(event, value) => {
            setDesiredStartingMonth(value);
          }}
        />
        <Button
          color="primary"
          size="lg"
          variant="solid"
          loading={isFetching}
          loadingPosition="start"
          disabled={!coordinatesAreValid || !desiredStartingMonth}
          onClick={async () => {
            coordinatesAreValid &&
              (await fetchKitas({
                lat: coordinates.lat as number,
                lng: coordinates.lng as number,
              }));
          }}
        >
          Kitas finden
        </Button>
      </div>
    </div>
  );
};

export default Search;
