import React from "react";
import { useSearchContext } from "../SearchContext";
import { useKitaListContext } from "../KitaList/KitaListContext";
import KitaMap from "./KitaMap";

type KitaMapViewProps = {};

const KitaMapView: React.FC<KitaMapViewProps> = ({}) => {
  const { kitas } = useKitaListContext();
  const { coordinates, coordinatesAreValid } = useSearchContext();

  return (
    <div
      id="finder-map"
      className="flex h-full w-full flex-grow lg:h-fit lg:min-h-[500px] xl:h-full xl:min-h-full"
    >
      <KitaMap kitas={[]} centerCoordinates={coordinates} />
    </div>
  );
};

export default KitaMapView;
