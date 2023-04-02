import React from "react";
import { Kita } from "../../../../types";
import KitaListItem from "./KitaListItem";

type KitaListProps = {
  kitas: Kita[];
};

const KitaList: React.FC<KitaListProps> = ({ kitas }) => {
  return (
    <div className="gap flex flex-col gap-2">
      {kitas.map((kita, index) => (
        <KitaListItem key={kita.uuid + index} kita={kita} />
      ))}
    </div>
  );
};

export default KitaList;
