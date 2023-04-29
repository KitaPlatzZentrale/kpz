import React from "react";
import { useKitaListScrollContext } from "../../desktop/components/KitaList/KitaListScrollContext";

import Map, { MapProvider, NavigationControl, useMap } from "react-map-gl";
import mapboxgl, { LngLat } from "mapbox-gl";

import HomeMarker from "./Markers/HomeMarker/HomeMarker";
import KitaMarker from "./Markers/KitaMarker/KitaMarker";
import KitaPopup from "../../desktop/components/Map/KitaPopup/KitaPopup";

import { DEFAULT_BERLIN_CENTER } from "../defaults";

import type { Kita } from "../../../../types";
import type { LatLng } from "../types";

import "mapbox-gl/dist/mapbox-gl.css";

type KitaMapProps = {
  kitas: Kita[];
  centerCoordinates: {
    lat?: number;
    lng?: number;
  };
  showNavigation?: boolean;
};

const KitaMap: React.FC<KitaMapProps> = ({
  kitas = [],
  centerCoordinates = DEFAULT_BERLIN_CENTER,
  showNavigation = true,
}) => {
  const [featuredKitaInPopup, setFeaturedKitaInPopup] =
    React.useState<Kita | null>(null);

  const { scrollTo, generateElementScrollAnchor } = useKitaListScrollContext();

  React.useEffect(() => {
    if (!featuredKitaInPopup) return;
    const kitaListItemAnchor = generateElementScrollAnchor(
      featuredKitaInPopup.uuid
    );
    kitaListItemAnchor && scrollTo(kitaListItemAnchor);
  }, [featuredKitaInPopup]);

  const kitaMarkers = React.useMemo(
    () =>
      kitas?.map((kita) => (
        <KitaMarker
          key={"kitamarker" + kita.uuid}
          kita={kita}
          onClick={() => setFeaturedKitaInPopup(kita)}
        />
      )),
    [kitas]
  );

  React.useEffect(() => {
    if (kitas === null || kitas.length === 0) setFeaturedKitaInPopup(null);
  }, [kitas]);

  return (
    <MapProvider>
      <Map
        id="finderMap" // used to find the map with useMap(), if you remove this the programmatic control won't work
        reuseMaps
        mapboxAccessToken="pk.eyJ1IjoiaGFubm9ncmltbSIsImEiOiJjbGdtamwyZHowNmxnM2VxbTd6eHZhMjExIn0.0wHQJStc2kgDh29Ewv_g-w"
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        initialViewState={{
          latitude: centerCoordinates?.lat || DEFAULT_BERLIN_CENTER.lat,
          longitude: centerCoordinates?.lng || DEFAULT_BERLIN_CENTER.lng,
          zoom: 12,
        }}
        interactive
        maxPitch={0}
        dragRotate={false}
        minZoom={12}
        maxZoom={16}
      >
        {showNavigation && <NavigationControl showZoom position="top-right" />}
        {centerCoordinates &&
          typeof centerCoordinates.lat === "number" &&
          typeof centerCoordinates.lng === "number" && (
            <HomeMarker coordinates={centerCoordinates} />
          )}
        {kitaMarkers}
        {featuredKitaInPopup && (
          <KitaPopup
            kita={featuredKitaInPopup}
            coordinates={{
              lat: featuredKitaInPopup.location.coordinates[1],
              lng: featuredKitaInPopup.location.coordinates[0],
            }}
            onClose={() => setFeaturedKitaInPopup(null)}
          />
        )}
      </Map>
      <ProgrammaticMapControl
        coordinates={centerCoordinates}
        markers={kitaMarkers}
      />
    </MapProvider>
  );
};

type ProgrammaticMapControlProps = {
  markers?: JSX.Element[];
  coordinates: LatLng;
};

const ProgrammaticMapControl: React.FC<ProgrammaticMapControlProps> = ({
  markers = [],
  coordinates,
}) => {
  const { finderMap } = useMap();

  const handleCoordinatesChange = (newCoordinates: LatLng) => {
    if (!finderMap) return;
    if (Number.isNaN(newCoordinates.lat) || Number.isNaN(newCoordinates.lng))
      return;

    finderMap.flyTo({
      center: new LngLat(newCoordinates.lng, newCoordinates.lat),
      zoom: 14,
    });
  };

  React.useEffect(() => {
    if (!finderMap) return;
    if (coordinates.lat === null || coordinates.lng === null) return;

    handleCoordinatesChange(coordinates);
  }, [coordinates]);

  React.useEffect(() => {
    if (!finderMap) return;
    if (markers.length === 0) return;

    const markersBounds = new mapboxgl.LngLatBounds();

    markers.forEach((marker) => {
      markersBounds.extend(
        new LngLat(
          marker.props.kita.location.coordinates[0],
          marker.props.kita.location.coordinates[1]
        )
      );
    });

    finderMap.fitBounds(markersBounds, {
      animate: true,
      linear: true,
      essential: true,
      screenSpeed: 0.5,
      maxZoom: 14,
    });
  }, [markers]);

  return <div></div>;
};

export default KitaMap;
