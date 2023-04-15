import React from "react";
import { Kita } from "../../../../types";
import { useKitaListContext } from "../KitaListContext";
import KitaListItem, { KitaListItemSkeleton } from "./KitaListItem";

type KitaListProps = {};

const KitaList: React.FC<KitaListProps> = () => {
  const { kitas } = useKitaListContext();

  const [currentKitas, setCurrentKitas] = React.useState<Kita[] | null>(
    kitas || null
  );

  React.useEffect(() => {
    setCurrentKitas(kitas);
  }, [kitas]);

  return (
    <div className="gap flex flex-col gap-2">
      {currentKitas !== null ? (
        currentKitas.length > 0 ? (
          currentKitas.map((kita, index) => (
            <KitaListItem key={kita.uuid + index} kita={kita} />
          ))
        ) : (
          <div className="text-center text-gray-500">Keine Kitas gefunden</div>
        )
      ) : (
        Array.from({ length: 15 }).map((_, index) => (
          <KitaListItemSkeleton key={"kitaitemskeleton" + index} />
        ))
      )}
    </div>
  );
};

export default KitaList;
