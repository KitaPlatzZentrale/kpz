import React from "react";
import { useSearchContext } from "../common/KitaSearchContext";
import { useKitaListContext } from "../common/KitaDataContext";
import KitaMap from "../common/Map/KitaMap";

type KitaMapViewProps = {
  height: number;
};

const KitaMapView: React.FC<KitaMapViewProps> = ({ height }) => {
  const { kitas } = useKitaListContext();
  const { coordinates, coordinatesAreValid } = useSearchContext();

  return (
    <div
      id="finder-map"
      className={`flex h-full w-full flex-grow lg:h-full lg:min-h-[500px] xl:h-full xl:min-h-[${height}px]`}
    >
      <KitaMap kitas={kitas || []} centerCoordinates={coordinates} />
    </div>
  );
};

export default KitaMapView;
