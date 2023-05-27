import React from "react";
import { Kita } from "../../../../../types";
import ServiceBanner from "../../../../../components/ServiceBanner";
import KitaListItem, { KitaListItemSkeleton } from "./KitaListItem";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../../../tailwind.config";
import clsx from "clsx";
import { useKitaListScrollContext } from "./KitaListScrollContext";

const screenIsSmallerThanLg = () => {
  const { theme } = resolveConfig(tailwindConfig);
  const screens = theme.extend ? theme.extend.screens : { lg: 1024 };
  return window.innerWidth <= screens.lg;
};

type KitaListProps = {
  kitas: Kita[] | null;
  className?: string;
};

const KitaList: React.FC<KitaListProps> = ({ kitas, className }) => {
  const { generateElementScrollAnchor } = useKitaListScrollContext();

  const advertisementIndex = React.useMemo(() => {
    if (kitas === null) return null;

    const kitasCount = kitas.length;

    if (kitasCount < 3) return null;
    if (kitasCount < 5) return 2;
    if (kitasCount < 10) return 3;
    else return 4;
  }, [kitas]);

  return (
    <div
      className={clsx(
        "gap flex flex-col gap-2 px-4 sm:px-6 md:px-8 lg:px-0",
        className
      )}
    >
      {kitas !== null ? (
        kitas.length > 0 ? (
          kitas.map((kita, index) => {
            if (advertisementIndex === index) {
              return (
                <>
                  <ServiceBanner />
                  <KitaListItem
                    id={generateElementScrollAnchor(kita.uuid)}
                    kita={kita}
                  />
                </>
              );
            } else
              return (
                <KitaListItem
                  id={generateElementScrollAnchor(kita.uuid)}
                  kita={kita}
                />
              );
          })
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
