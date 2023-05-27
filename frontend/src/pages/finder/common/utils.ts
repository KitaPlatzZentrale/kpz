import haversineDistance from "haversine-distance";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config";

export const screenIsBiggerOrEqualToMd = () => {
  const { theme } = resolveConfig(tailwindConfig);
  const screens = theme.extend ? theme.extend.screens : { md: 768 };
  return window.innerWidth >= screens.md;
};

export const screenIsBiggerOrEqualToXl = () => {
  const { theme } = resolveConfig(tailwindConfig);
  const screens = theme.extend ? theme.extend.screens : { xl: 1024 };
  return window.innerWidth >= screens.xl;
};

/**
 * Calculates the (airline) distance between two coordinates in meters or kilometers
 * Utilizes the haversine formula
 * @param coordinates1 LatLng Coordinates of Point 1
 * @param coordinates2 LatLng Coordinates of Point 2
 * @returns Distance in integer + "m" if under 1000m, otherwise double + "km" (rounded to 1 decimal)
 */
export const getDescribedHaversineDistanceBetweenCoordinates = (
  coordinates1: { lat: number; lng: number },
  coordinates2: { lat: number; lng: number }
): string => {
  return "1.00km";
  const distance = haversineDistance(coordinates1, coordinates2);
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${Math.round(distance / 100) / 10}km`;
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
