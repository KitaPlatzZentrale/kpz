import { Button, CircularProgress } from "@mui/joy";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useKitaListContext } from "../common/KitaDataContext";
import { useSearchContext } from "../common/KitaSearchContext";

import KitaList from "../desktop/components/KitaList/KitaList";
import BottomDrawer, {
  DEFAULT_DRAWER_ANCHORS,
} from "./components/BottomDrawer";
import SearchOverlay from "./components/SearchOverlay";
import { useMobileOverlay } from "../../../components/MobileOverlay/MobileOverlayContext";

type KitaListMobileViewProps = React.PropsWithChildren<{}>;

const StartKitaSearchListView = () => {
  const { isOpen: isSearchOverlayOpen, setOpen: setSearchOverlayOpen } =
    useMobileOverlay("kita-search");

  return (
    <div className="mt-1 flex w-full flex-col items-center justify-center">
      <Button
        variant="solid"
        size="lg"
        style={{ padding: "20px 40px" }}
        color="primary"
        onClick={() => setSearchOverlayOpen(true)}
      >
        Suche starten
      </Button>
    </div>
  );
};

const KitaListMobileView: React.FC<KitaListMobileViewProps> = ({
  children,
}) => {
  const { kitas, isFetching } = useKitaListContext();

  const { submitted } = useSearchContext();

  const noSearchHasStarted = !submitted;

  const kitaListDrawerDefaultBleeding = 70;

  return (
    <>
      <SearchOverlay />
      <BottomDrawer
        anchors={{
          ...DEFAULT_DRAWER_ANCHORS(),
          closed: {
            ...DEFAULT_DRAWER_ANCHORS().closed,
            offset: kitaListDrawerDefaultBleeding,
          },
        }}
      >
        <h3
          className={clsx(
            "mb-3 w-full text-center text-base",
            !kitas || kitas.length === 0 ? "font-medium" : "font-extrabold"
          )}
        >
          {noSearchHasStarted
            ? "Starten Sie Ihre Suche"
            : isFetching
            ? "Suche läuft..."
            : `${kitas?.length || 0} Einrichtungen in der Nähe`}
        </h3>
        {noSearchHasStarted ? (
          <StartKitaSearchListView />
        ) : isFetching ? (
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-4">
            <CircularProgress size="lg" />
            <p className="text-sm">Tageseinrichtungen werden ermittelt</p>
          </div>
        ) : (
          <KitaList kitas={kitas || []} />
        )}
      </BottomDrawer>
    </>
  );
};

export default KitaListMobileView;
