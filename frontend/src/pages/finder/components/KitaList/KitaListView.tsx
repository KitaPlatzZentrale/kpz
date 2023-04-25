import React from "react";

import type { Kita } from "../../../../types";
import { useKitaListContext } from "./KitaListContext";
import KitaList from "./KitaList";
import { useKitaListScrollContext } from "./KitaListScrollContext";
import { useSearchContext } from "../SearchContext";
import AddressLookup from "../AddressLookup";
import FormAutocomplete from "../../../../components/FormAutocomplete";
import { DateRange } from "@mui/icons-material";
import { Button, FormControl, FormLabel } from "@mui/joy";

type KitaListViewProps = React.PropsWithChildren<{}>;

const StartKitaSearchListView = () => {
  const {
    setCoordinates,
    setAddress,
    coordinates,
    address,
    desiredStartingMonth,
    setDesiredStartingMonth,
    coordinatesAreValid,
    submit,
  } = useSearchContext();

  const { isFetching } = useKitaListContext();

  return (
    <div className="flex w-full flex-col">
      <h3 className="mb-4 text-2xl font-extrabold">Kitas in der Nähe finden</h3>
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
  );
};

const KitaListView: React.FC<KitaListViewProps> = ({ children }) => {
  const { kitas } = useKitaListContext();
  const { listRef } = useKitaListScrollContext();

  const { submitted } = useSearchContext();

  const noSearchHasStarted = !submitted;

  return (
    <div className="xs:page-padding sm:page-padding md:page-padding lg:page-padding absolute z-50 flex w-full flex-col rounded-t-xl bg-gray-50 px-5 py-8 lg:relative lg:z-0 lg:max-w-[900px] xl:w-1/2 xl:pl-0 xl:pr-6">
      {noSearchHasStarted ? (
        <StartKitaSearchListView />
      ) : (
        <div ref={listRef} className="flex flex-col gap-2 overflow-y-scroll">
          <>
            <div className="mb-4 flex flex-col gap-1">
              <span className="text-xl font-extrabold text-gray-800">
                {kitas?.length || 0} Einrichtungen in der Nähe
              </span>
              <span className="text-gray-500">
                Informationen und Verfügbarkeiten nach{" "}
                <a
                  className="font-bold text-happy-blue"
                  target="_blank"
                  href="https://berlin.de"
                >
                  berlin.de
                </a>
              </span>
            </div>
          </>

          <div className="flex flex-row items-start">
            <KitaList className="w-full" kitas={kitas} />
          </div>
        </div>
      )}
    </div>
  );
};

export default KitaListView;
