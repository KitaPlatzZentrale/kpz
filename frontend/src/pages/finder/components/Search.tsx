import { DateRange } from "@mui/icons-material";
import { Button, FormControl, FormLabel } from "@mui/joy";
import React from "react";
import CentricContent from "../../../components/CentricContent";
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
    <div className="w-full bg-white pb-10 pt-10">
      <CentricContent>
        <h3 className="mb-4 text-2xl font-extrabold">Kitas suchen</h3>
        <div className="flex w-full max-w-7xl flex-col items-stretch gap-6 lg:flex-row lg:items-start">
          <AddressLookup
            className="lg:w-full"
            onAddressSelected={(address) => {
              setAddress(address);
            }}
            onCoordinatesSuccessfullyRetrieved={(coordinates) => {
              setCoordinates(coordinates);
            }}
          />
          <FormAutocomplete
            formControlProps={{
              className: "w-full lg:w-1/4",
            }}
            label="Gewünschter Beginn"
            placeholder="z.B. Mai 2023"
            startDecorator={<DateRange />}
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
          <FormControl>
            <FormLabel style={{ opacity: 0 }}>Einreichen</FormLabel>
            <Button
              style={{ padding: "20px 60px" }}
              className="w-full lg:w-fit"
              color="info"
              size="lg"
              variant="solid"
              loading={isFetching}
              loadingPosition="center"
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
          </FormControl>
        </div>
      </CentricContent>
    </div>
  );
};

export default Search;
