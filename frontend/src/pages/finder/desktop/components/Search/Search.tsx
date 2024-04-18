import { DateRange } from "@mui/icons-material";
import { Button, FormControl, FormLabel } from "@mui/joy";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import FormAutocomplete from "../../../../../components/FormAutocomplete";
import { useSearchContext } from "../../../common/KitaSearchContext";
import AddressLookup from "../../../../../components/AddressLookup";
import { useKitaListContext } from "../../../common/KitaDataContext";
import { generateMonthOptions, getCurrentMonth } from "../../../common/utils";

type SearchProps = {
  id?: string;
  className?: string;
  rootRef?: React.RefObject<HTMLDivElement>;
};

const Search: React.FC<SearchProps> = ({ id, className, rootRef }) => {
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [monthOptions, setMonthOptions] = useState<string[]>([]);

  useEffect(() => {
    setCurrentMonth(getCurrentMonth());
    setMonthOptions(generateMonthOptions());
  }, []);

  const {
    setCoordinates,
    setAddress,
    desiredStartingMonth,
    setDesiredStartingMonth,
    coordinatesAreValid,
    submit,
  } = useSearchContext();

  const { isFetching } = useKitaListContext();

  return (
    <div
      ref={rootRef}
      id={id}
      className={clsx(
        "page-padding flex w-full flex-row justify-between bg-white pb-6 pt-10 align-baseline",
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
              if (coordinates.lat == null || coordinates.lng == null) return;

              setCoordinates(coordinates);
            }}
          />
          <FormAutocomplete
            formControlProps={{
              className: "w-full lg:w-1/4",
            }}
            label="Gewünschter Beginn"
            placeholder={`z.B. ${currentMonth || "loading..."}`}
            startDecorator={<DateRange />}
            value={desiredStartingMonth}
            options={monthOptions}
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
                await submit();
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
