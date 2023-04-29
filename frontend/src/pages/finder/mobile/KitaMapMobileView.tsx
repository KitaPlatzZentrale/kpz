import React from "react";
import { useSearchContext } from "../common/KitaSearchContext";
import { useKitaListContext } from "../common/KitaDataContext";
import KitaMap from "../common/Map/KitaMap";

type KitaMapMobileViewProps = {};

const KitaMapMobileView: React.FC<KitaMapMobileViewProps> = ({}) => {
  const { kitas } = useKitaListContext();
  const { coordinates } = useSearchContext();

  return (
    <div id="finder-map" className="fixed flex h-full w-full flex-grow">
      <KitaMap
        kitas={kitas || []}
        centerCoordinates={coordinates}
        showNavigation={false}
      />
    </div>
  );
};

export default KitaMapMobileView;
