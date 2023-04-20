import { Marker } from "react-map-gl";
import { Kita } from "../../../../../../types";
import KitaMarkerInner from "./KitaMarkerInner";

type KitaMarkerProps = {
  kita: Kita;
  onClick?: (kita: Kita) => void;
};

const KitaMarker: React.FC<KitaMarkerProps> = ({ kita, onClick }) => {
  return (
    <Marker
      latitude={kita.coordinates.lat}
      longitude={kita.coordinates.lng}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick?.(kita);
      }}
      style={{
        cursor: "pointer",
      }}
    >
      <KitaMarkerInner />
    </Marker>
  );
};

export default KitaMarker;
