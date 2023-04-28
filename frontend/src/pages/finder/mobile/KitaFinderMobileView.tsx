import React from "react";
import KitaListMobileView from "./KitaListMobileView";
import KitaMapMobileView from "./KitaMapMobileView";

type KitaFinderMobileViewProps = {
  height: number;
};

const KitaFinderMobileView: React.FC<KitaFinderMobileViewProps> = ({
  height,
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div
        id="content"
        style={{ height }}
        className="flex w-full flex-col overflow-y-hidden"
      >
        <KitaMapMobileView />
        <KitaListMobileView />
      </div>
    </div>
  );
};

export default KitaFinderMobileView;
