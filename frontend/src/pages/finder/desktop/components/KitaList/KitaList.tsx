import React, { memo } from "react";
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

  const advertisementIndex = 4;

  const SkeletonItem = memo(KitaListItemSkeleton);

  const kitaListItems = React.useMemo(() => {
    if (kitas === null) return null;
    if (kitas.length === 0) return null;

    return kitas.map((kita, index) => {
      return (
        <>
          {advertisementIndex === index && <ServiceBanner />}
          <KitaListItem
            key={"kitalistitem-" + kita.uuid}
            id={generateElementScrollAnchor(kita.uuid)}
            kita={kita}
          />
        </>
      );
    });
  }, [kitas]);

  console.log("yo");

  return (
    <div
      className={clsx(
        "gap flex flex-col gap-2 px-4 sm:px-6 md:px-8 lg:px-0",
        className
      )}
    >
      {kitaListItems ? (
        kitaListItems.map((kita, index) => kita)
      ) : (
        <div className="text-center text-gray-500">Keine Kitas gefunden</div>
      )}
    </div>
  );
};

export default KitaList;
