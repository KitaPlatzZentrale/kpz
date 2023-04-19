import React from "react";
import Map, {
  MapProvider,
  Marker,
  NavigationControl,
  Popup,
  useMap,
} from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import {
  DEFAULT_BERLIN_CENTER,
  LatLng,
  useSearchContext,
} from "../../../../components/SearchContext";
import { useKitaListContext } from "../KitaList/KitaListContext";
import mapboxgl from "mapbox-gl";
import { useKitaListScrollContext } from "../KitaList/KitaListScrollContext";
import { useTheme } from "@mui/joy";
import { Kita } from "../../../../types";
import { KitaListCard } from "../KitaList/KitaListItem";

const KitaPin = () => {
  const { palette } = useTheme();

  // create svg pin that resembles the default mapboy-gl pin with color palette.success[600] and add a icon that indicates a kindergarden
  return (
    <div className="cursor-pointer transition-all ease-in-out hover:scale-[115%]">
      <svg
        width="28"
        height="42"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="black"
          stroke="black"
          strokeOpacity={0.5}
          opacity={0.25}
          transform="translate(7, 32)"
          // round circle thats tilted so its fully visible in the viewport despite being at position 28 of 33
          // make the circle very small, not more than 3 px
          d="M 0 0 A 5 3 0 1 1 0 0.0001 Z"
        />
        <path
          d="M0.832031 12.0002C0.832031 5.82631 5.82484 0.833496 11.9987 0.833496C18.1726 0.833496 23.1654 5.82631 23.1654 12.0002C23.1654 15.3304 21.3878 19.3632 19.1755 23.0733C16.9757 26.7623 14.3983 30.0479 12.8973 31.8642C12.4305 32.4234 11.5832 32.4233 11.1166 31.8639C9.60788 30.0485 7.02598 26.7625 4.82387 23.0731C2.60953 19.3631 0.832031 15.3303 0.832031 12.0002ZM7.33203 12.0002C7.33203 14.5763 9.42255 16.6668 11.9987 16.6668C14.5748 16.6668 16.6654 14.5763 16.6654 12.0002C16.6654 9.42402 14.5748 7.3335 11.9987 7.3335C9.42255 7.3335 7.33203 9.42402 7.33203 12.0002Z"
          fill={palette.primary[700]}
          stroke={palette.neutral[900]}
          strokeOpacity={0.7}
          strokeWidth={0.8}
        />
        {/** add little hover shadow at the very bottom of the pin (path above) so it seems the pin positioned on the map casts a shadow */}
      </svg>
    </div>
  );
};

const HomePin = () => {
  const { palette } = useTheme();

  // create svg pin that resembles the default mapboy-gl pin with color palette.success[600] and add a icon that indicates a home
  return (
    <svg
      width="28"
      height="42"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="black"
        stroke="black"
        strokeOpacity={0.5}
        opacity={0.25}
        transform="translate(7, 32)"
        // round circle thats tilted so its fully visible in the viewport despite being at position 28 of 33
        // make the circle very small, not more than 3 px
        d="M 0 0 A 5 3 0 1 1 0 0.0001 Z"
      />

      <path
        d="M0.832031 12.0002C0.832031 5.82631 5.82484 0.833496 11.9987 0.833496C18.1726 0.833496 23.1654 5.82631 23.1654 12.0002C23.1654 15.3304 21.3878 19.3632 19.1755 23.0733C16.9757 26.7623 14.3983 30.0479 12.8973 31.8642C12.4305 32.4234 11.5832 32.4233 11.1166 31.8639C9.60788 30.0485 7.02598 26.7625 4.82387 23.0731C2.60953 19.3631 0.832031 15.3303 0.832031 12.0002ZM7.33203 12.0002C7.33203 14.5763 9.42255 16.6668 11.9987 16.6668C14.5748 16.6668 16.6654 14.5763 16.6654 12.0002C16.6654 9.42402 14.5748 7.3335 11.9987 7.3335C9.42255 7.3335 7.33203 9.42402 7.33203 12.0002Z"
        fill={palette.info[600]}
        stroke={palette.neutral[900]}
        strokeOpacity={0.5}
        transform="translate(0, 0)"
      />
    </svg>
  );
};

type HereMapProps = {};

const HereMap: React.FC<HereMapProps> = ({}) => {
  const { kitas } = useKitaListContext();
  const { coordinates: currentSearchCoordinates } = useSearchContext();

  const [featuredKitaInPopup, setFeaturedKitaInPopup] =
    React.useState<Kita | null>(null);

  const { scrollTo, generateElementScrollAnchor } = useKitaListScrollContext();

  const kitaMarkers = React.useMemo(
    () =>
      kitas?.map((kita) => {
        return (
          <Marker
            key={"kitamarker" + kita.uuid}
            latitude={kita.coordinates.lat}
            longitude={kita.coordinates.lng}
            anchor="center"
            onClick={(e) => {
              const kitaListItemAnchor = generateElementScrollAnchor(kita.uuid);
              kitaListItemAnchor && scrollTo(kitaListItemAnchor);

              e.originalEvent.stopPropagation();
              setFeaturedKitaInPopup(kita);
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <KitaPin />
          </Marker>
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
            anchor="bottom"
          >
            <HomePin />
          </Marker>
        )}
        {featuredKitaInPopup && (
          <Popup
            latitude={featuredKitaInPopup.coordinates.lat}
            longitude={featuredKitaInPopup.coordinates.lng}
            anchor="bottom"
            onClose={() => setFeaturedKitaInPopup(null)}
            style={{
              padding: 0,
            }}
            maxWidth="inherit"
            className="rounded-lg"
            closeButton={false}
          >
            <KitaListCard
              onClose={() => {
                setFeaturedKitaInPopup(null);
              }}
              kita={featuredKitaInPopup}
            />
          </Popup>
        )}
      </Map>
      <ProgrammaticMapControl markers={kitaMarkers} />
    </MapProvider>
  );
};

const ProgrammaticMapControl: React.FC = ({
  markers = [],
}: {
  markers?: any[];
}) => {
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
    if (markers.length === 0) return;

    const markersBounds = new mapboxgl.LngLatBounds();

    markers.forEach((marker) => {
      markersBounds.extend([marker.props.longitude, marker.props.latitude]);
    });

    finderMap.fitBounds(markersBounds, {
      animate: true,
      linear: true,
      essential: true,
      screenSpeed: 0.5,
      maxZoom: 14,
    });
  }, [markers]);

  React.useEffect(() => {
    if (!finderMap) return;

    handleCoordinatesChange(searchCoordinates);
  }, []);

  return <></>;
};

export default HereMap;
