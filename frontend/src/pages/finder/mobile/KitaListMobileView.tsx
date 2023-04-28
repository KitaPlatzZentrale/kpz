import { Button } from "@mui/joy";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useKitaListContext } from "../common/KitaDataContext";
import { useSearchContext } from "../common/KitaSearchContext";

import KitaList from "../desktop/components/KitaList/KitaList";
import { KitaListItemSkeleton } from "../desktop/components/KitaList/KitaListItem";
import BottomDrawer, {
  DEFAULT_DRAWER_ANCHORS,
} from "./components/BottomDrawer";
import SearchOverlay from "./components/SearchOverlay";
import { useSearchOverlayContext } from "./components/SearchOverlayContext";

type KitaListMobileViewProps = React.PropsWithChildren<{}>;

const StartKitaSearchListView = () => {
  const { open: isSearchOverlayOpen, setOpen: setSearchOverlayOpen } =
    useSearchOverlayContext();

  return (
    <AnimatePresence>
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
      <motion.div
        key="start-search-information-skeletons"
        className="mt-0 flex w-full flex-col gap-2"
        style={{ overflow: "hidden" }}
      >
        {Array.from({ length: 5 }).map((opacity, index) => (
          <motion.div
            key={`start-search-information-skeleton-${index}`}
            transition={{
              type: "spring",
              delay: index * 0.05,
              bounce: 0,
            }}
            initial={{ opacity: 0, y: 200 }}
            animate={{ y: 0, opacity: 0.8 }}
          >
            <KitaListItemSkeleton animate={false} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

const KitaListMobileView: React.FC<KitaListMobileViewProps> = ({
  children,
}) => {
  const { kitas } = useKitaListContext();

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
            : `${kitas?.length || 0} Einrichtungen in der Nähe`}
        </h3>
        {noSearchHasStarted ? (
          <StartKitaSearchListView />
        ) : (
          <KitaList kitas={kitas || []} />
        )}
      </BottomDrawer>
    </>
  );
};

export default KitaListMobileView;
