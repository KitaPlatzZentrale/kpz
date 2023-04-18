import React from "react";
import Map, {
  MapProvider,
  Marker,
  NavigationControl,
  useMap,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import {
  DEFAULT_BERLIN_CENTER,
  LatLng,
  useSearchContext,
} from "../../../../components/SearchContext";
import { useKitaListContext } from "../KitaListContext";

type HereMapProps = {};

const HereMap: React.FC<HereMapProps> = ({}) => {
  const { kitas } = useKitaListContext();
  const { coordinates: currentSearchCoordinates } = useSearchContext();

  const kitaMarkers = React.useMemo(
    () =>
      kitas?.map((kita) => {
        return (
          <Marker
            key={"kitamarker" + kita.uuid}
            latitude={kita.coordinates.lat}
            longitude={kita.coordinates.lng}
            anchor="center"
            color="#3FB1CE"
          ></Marker>
        );
      }),
    [kitas]
  );

  return (
    <MapProvider>
      <Map
        id="finderMap"
        reuseMaps
        mapboxAccessToken="pk.eyJ1IjoiaGFubm9ncmltbSIsImEiOiJjbGdtamwyZHowNmxnM2VxbTd6eHZhMjExIn0.0wHQJStc2kgDh29Ewv_g-w"
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        initialViewState={{
          latitude:
            currentSearchCoordinates.lat || DEFAULT_BERLIN_CENTER.latitude,
          longitude:
            currentSearchCoordinates.lng || DEFAULT_BERLIN_CENTER.longitude,
          zoom: 12,
        }}
        interactive
        minZoom={12}
        maxZoom={16}
      >
        <NavigationControl showZoom position="top-right" />
        {kitaMarkers}
        {currentSearchCoordinates.lat && currentSearchCoordinates.lng && (
          <Marker
            latitude={currentSearchCoordinates.lat}
            longitude={currentSearchCoordinates.lng}
            anchor="center"
            color="red"
          ></Marker>
        )}
      </Map>
      <ProgrammaticMapControl />
    </MapProvider>
  );
};

const ProgrammaticMapControl: React.FC = () => {
  const { finderMap } = useMap();

  const {
    coordinates: searchCoordinates,
    coordinatesAreValid: searchCoordinatesAreValid,
  } = useSearchContext();

  const handleCoordinatesChange = (searchCoordinates: LatLng) => {
    if (!finderMap) return;

    if (searchCoordinates.lat && searchCoordinates.lng) {
      finderMap.flyTo({
        center: [searchCoordinates.lng, searchCoordinates.lat],
        zoom: 14,
      });
    }
  };

  React.useEffect(() => {
    console.log(finderMap);
    if (!finderMap) return;
    if (!searchCoordinatesAreValid) return;

    handleCoordinatesChange(searchCoordinates);
  }, [searchCoordinatesAreValid, searchCoordinates]);

  React.useEffect(() => {
    if (!finderMap) return;

    handleCoordinatesChange(searchCoordinates);
  }, []);

  return <></>;
};

export default HereMap;
