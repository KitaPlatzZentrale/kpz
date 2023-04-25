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
      latitude={kita.location.coordinates[1]}
      longitude={kita.location.coordinates[0]}
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
