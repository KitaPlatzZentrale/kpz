import { ListAlt, ListOutlined, Map } from "@mui/icons-material";
import { Chip, List } from "@mui/joy";
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

  const kitasFound = currentKitas !== null && currentKitas.length > 0;

  return (
    <div className="gap flex flex-col gap-2">
      {kitasFound && (
        <>
          <div className="mb-1 flex flex-row gap-5">
            <span className="text-base font-bold text-gray-800">
              {currentKitas?.length} Ergebnisse
            </span>
            <span className="text-gray-500">
              Informationen und Verfügbarkeiten nach{" "}
              <a
                className="font-bold text-happy-blue"
                target="_blank"
                href="https://berlin.de"
              >
                berlin.de
              </a>
            </span>
          </div>
          <div className="mb-3 flex flex-row gap-4">
            <Chip
              startDecorator={<ListOutlined />}
              color="info"
              variant="soft"
              size="md"
              sx={{ cursor: "pointer" }}
            >
              Liste
            </Chip>
            <Chip
              startDecorator={<Map />}
              endDecorator={
                <Chip
                  color="neutral"
                  size="sm"
                  color="neutral"
                  variant="plain"
                  disabled
                >
                  Bald verfügbar
                </Chip>
              }
              color="neutral"
              variant="outlined"
              disabled
              size="md"
              sx={{ cursor: "not-allowed" }}
            >
              Karte
            </Chip>
          </div>
        </>
      )}
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
          <KitaListItemSkeleton
            index={index}
            key={"kitaitemskeleton" + index}
          />
        ))
      )}
    </div>
  );
};

export default KitaList;
