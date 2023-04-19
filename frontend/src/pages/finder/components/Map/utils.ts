import { LatLng } from "../../../../components/SearchContext";

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
