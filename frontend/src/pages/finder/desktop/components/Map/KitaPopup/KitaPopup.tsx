import React from "react";
import { Popup } from "react-map-gl";
import { Kita } from "../../../../../types";
import KitaPopupInner from "./KitaPopupInner";

type KitaPopupProps = {
  kita: Kita;
  coordinates: {
    lat: number;
    lng: number;
  };
  onClose?: (kita: Kita) => void;
};

const KitaPopup: React.FC<KitaPopupProps> = ({
  kita,
  coordinates,
  onClose,
}) => {
  return (
    <Popup
      latitude={coordinates.lat}
      longitude={coordinates.lng}
      anchor="bottom"
      onClose={() => onClose?.(kita)}
      style={{
        padding: 0,
      }}
      maxWidth="inherit"
      className="rounded-lg"
      closeButton={false}
    >
      <KitaPopupInner
        onClose={() => {
          onClose?.(kita);
        }}
        kita={kita}
      />
    </Popup>
  );
};

export default KitaPopup;
