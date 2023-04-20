import React from "react";
import { DEFAULT_BERLIN_CENTER, useSearchContext } from "../SearchContext";
import { useKitaListContext } from "../KitaList/KitaListContext";
import KitaMap from "./KitaMap";

type KitaMapViewProps = {};

const KitaMapView: React.FC<KitaMapViewProps> = ({}) => {
  const { kitas } = useKitaListContext();
  const { coordinates, coordinatesAreValid } = useSearchContext();

  console.log(coordinates);

  return (
    <div
      id="finder-map"
      className="flex min-h-[500px] w-full flex-grow xl:h-full xl:min-h-full"
    >
      <KitaMap kitas={kitas || []} centerCoordinates={DEFAULT_BERLIN_CENTER} />
    </div>
  );
};

export default KitaMapView;
