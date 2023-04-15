import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [geoloc, setGeoloc] = useState<{
    latitude: any;
    longitude: any;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [permissionGranted, setPermissionGranted] = useState(false);

  const onChange = ({ coords: { latitude, longitude } }) => {
    setGeoloc({
      latitude,
      longitude,
    });
  };

  const onError = (error) => setError(error.message);

  const handlePermissionGranted = () => {
    setPermissionGranted(true);

    const geo = navigator.geolocation;

    if (!geo) {
      setError("Geolocation is not supported");
      return;
    }

    geo.getCurrentPosition(onChange, onError);
  };

  const requestPermission = () => {
    if (permissionGranted) return;
    const req = new Promise((resolve, reject) => {
      const permissionResult = window.navigator.permissions.query({
        name: "geolocation",
      });

      permissionResult.then((result) => {
        if (result.state === "granted") {
          resolve("granted");
        } else if (result.state === "prompt") {
          reject("prompt");
        } else if (result.state === "denied") {
          reject("denied");
        }

        result.onchange = () => {
          if (result.state === "granted") {
            resolve("granted");
          } else if (result.state === "prompt") {
            reject("prompt");
          } else if (result.state === "denied") {
            reject("denied");
          }
        };
      });
    });

    req.then(handlePermissionGranted).catch((err) => {
      setError(err);
    });
  };

  return {
    currentUserPosition: {
      ...geoloc,
    },
    requestPermission,
    error,
  };
};
