import React from "react";
import { useKitaListContext } from "../common/KitaDataContext";
import { useKitaListScrollContext } from "../desktop/components/KitaList/KitaListScrollContext";
import { useSearchContext } from "../common/KitaSearchContext";

import { Button, FormControl, FormLabel } from "@mui/joy";
import KitaList from "../desktop/components/KitaList/KitaList";
import AddressLookup from "../../../components/AddressLookup";
import BottomDrawer from "./components/BottomDrawer";

type KitaListMobileViewProps = React.PropsWithChildren<{}>;

const StartKitaSearchListMobileView = () => {
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

const KitaListMobileView: React.FC<KitaListMobileViewProps> = ({
  children,
}) => {
  const { kitas } = useKitaListContext();
  const { listRef } = useKitaListScrollContext();

  const { submitted } = useSearchContext();

  const noSearchHasStarted = !submitted;

  const kitaListDrawerDefaultBleeding = 56;

  return noSearchHasStarted ? (
    <BottomDrawer />
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
  );
};

export default KitaListMobileView;
