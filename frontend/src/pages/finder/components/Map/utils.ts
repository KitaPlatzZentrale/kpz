import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../../tailwind.config";

export const screenIsBiggerOrEqualToMd = () => {
  const { theme } = resolveConfig(tailwindConfig);
  const screens = theme.extend ? theme.extend.screens : { md: "768px" };
  return window.innerWidth >= screens.md;
};

// distance is a double in km (e.g. 0.04km)
export const getDistanceDescription = (distance: number) => {
  if (distance < 1) return (distance * 1000).toFixed(0) + "m";
  else return distance.toFixed(1) + "km";
};

// e.g. turn "August 2023" into "2023-08-01", day is always 01
// ist nicht schön aber wat soll's
export const transformMonthIntoISODate = (month: string | null) => {
  if (!month || month.length === 0) return null;

  const monthToNumber = {
    Januar: "01",
    Februar: "02",
    März: "03",
    April: "04",
    Mai: "05",
    Juni: "06",
    Juli: "07",
    August: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Dezember: "12",
  };

  const [monthName, year] = month.split(" ");
  const monthNumber = monthToNumber[monthName];

  return `${year}-${monthNumber}-01`;
};

export const getAppropriateZoomLevel = (
  markers: any[],
  mapWidth: number,
  mapHeight: number
) => {
  const MAP_WIDTH = 256; // Width of the map in pixels at zoom level 1
  const MAP_HEIGHT = 256; // Width of the map in pixels at zoom level 1;

  // Calculate the bounding box
  let minLat = markers[0].lat,
    maxLat = markers[0].lat,
    minLng = markers[0].lng,
    maxLng = markers[0].lng;

  markers.forEach((marker) => {
    minLat = Math.min(minLat, marker.lat);
    maxLat = Math.max(maxLat, marker.lat);
    minLng = Math.min(minLng, marker.lng);
    maxLng = Math.max(maxLng, marker.lng);
  });

  // dimensions of the bounding box in degrees
  const latDelta = maxLat - minLat;
  const lngDelta = maxLng - minLng;

  // zoom level for latitude and longitude
  const zoomLat = Math.log(mapHeight / MAP_WIDTH / latDelta) / Math.log(2);
  const zoomLng = Math.log(mapWidth / MAP_HEIGHT / lngDelta) / Math.log(2);

  // smaller zoom level win to ensure all markers are visible
  return Math.min(zoomLat, zoomLng);
};
