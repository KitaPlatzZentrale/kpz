import React from "react";
import { Marker } from "react-map-gl";
import type { LatLng } from "../../../SearchContext";
import HomeMarkerInner from "./HomeMarkerInner";

type HomeMarkerProps = {
  coordinates: LatLng;
};

const HomeMarker: React.FC<HomeMarkerProps> = ({ coordinates }) => {
  return (
    <Marker
      latitude={coordinates.lat as number}
      longitude={coordinates.lng as number}
      anchor="bottom"
    >
      <HomeMarkerInner />
    </Marker>
  );
};

export default HomeMarker;
