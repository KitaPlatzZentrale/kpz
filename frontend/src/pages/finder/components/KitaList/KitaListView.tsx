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
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-extrabold text-gray-800">
            {currentKitas?.length || 0} Einrichtungen in der Nähe
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
      </>

      <div className="flex flex-row items-start">
        <KitaList className="w-full" kitas={currentKitas} />
      </div>
    </div>
  );
};

export default KitaListView;
