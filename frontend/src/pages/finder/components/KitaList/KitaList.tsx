import React from "react";
import { Kita } from "../../../../types";
import { useKitaListContext } from "../KitaListContext";
import KitaListItem from "./KitaListItem";

type KitaListProps = {
  kitas?: Kita[];
};

const KitaList: React.FC<KitaListProps> = ({ kitas: kitasProp }) => {
  const { kitas } = useKitaListContext();

  const [currentKitas] = React.useState<Kita[]>(kitasProp || kitas || []);

  return (
    <div className="gap flex flex-col gap-2">
      {currentKitas.map((kita, index) => (
        <KitaListItem key={kita.uuid + index} kita={kita} />
      ))}
    </div>
  );
};

export default KitaList;
