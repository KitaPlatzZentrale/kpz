import { DateRange } from "@mui/icons-material";
import { Button, FormControl, FormLabel } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import CentricContent from "../../../components/CentricContent";
import FormAutocomplete from "../../../components/FormAutocomplete";
import { useSearchContext } from "../../../components/SearchContext";
import AddressLookup from "./AddressLookup";
import { useKitaListContext } from "./KitaList/KitaListContext";
import ServiceBanner from "./ServiceBanner";

type SearchProps = {
  id?: string;
  className?: string;
  rootRef?: React.RefObject<HTMLDivElement>;
};

const Search: React.FC<SearchProps> = ({ id, className, rootRef }) => {
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
    <div
      ref={rootRef}
      id={id}
      className={clsx(
        "page-padding flex w-full flex-row justify-between bg-white pb-6 pt-4 align-baseline",
        className
      )}
    >
      <div className="flex w-full flex-col">
        <h3 className="mb-4 text-2xl font-extrabold">
          Kitas in der Nähe finden
        </h3>
        <div className="flex w-full max-w-5xl flex-col items-stretch gap-6 lg:flex-row lg:items-start">
          <AddressLookup
            className="lg:w-full"
            onAddressSelected={async (address) => {
              setAddress(address);
            }}
            onCoordinatesSuccessfullyRetrieved={async (coordinates) => {
              setCoordinates(coordinates);

              if (coordinates.lat && coordinates.lng) {
                await fetchKitas(coordinates);
              }
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
              style={{ padding: "20px 40px" }}
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
      </div>
    </div>
  );
};

export default Search;
