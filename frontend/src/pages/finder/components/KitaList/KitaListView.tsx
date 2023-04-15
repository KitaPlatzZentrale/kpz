import React from "react";
import { ListOutlined, Map } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import type { Kita } from "../../../../types";
import { useKitaListContext } from "../KitaListContext";
import KitaList from "./KitaList";
import ServiceBanner from "../ServiceBanner";

type KitaListViewProps = React.PropsWithChildren<{}>;

const KitaListView: React.FC<KitaListViewProps> = ({ children }) => {
  const { kitas } = useKitaListContext();

  const [currentKitas, setCurrentKitas] = React.useState<Kita[] | null>(
    kitas || null
  );

  React.useEffect(() => {
    setCurrentKitas(kitas);
  }, [kitas]);

  return (
    <div className="gap flex flex-col gap-2">
      <>
        <div className="mb-1 flex flex-row gap-5">
          <span className="text-base font-bold text-gray-800">
            {currentKitas?.length || 0} Ergebnisse
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

      <div className="flex flex-row items-start">
        <KitaList className="w-full" kitas={currentKitas} />
      </div>
    </div>
  );
};

export default KitaListView;
