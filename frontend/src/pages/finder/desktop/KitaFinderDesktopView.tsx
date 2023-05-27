import React from "react";
import Search from "./components/Search/Search";
import KitaListView from "./KitaListView";
import KitaMapView from "./KitaMapView";

type KitaFinderDesktopViewProps = {
  height: number;
};

const KitaFinderDesktopView: React.FC<KitaFinderDesktopViewProps> = ({
  height,
}) => {
  return (
    <div className={`flex min-h-[${height}px] h-full w-full flex-col`}>
      <Search />
      <div
        id="content"
        style={{ height }}
        className="xl:page-padding flex h-full w-full flex-col-reverse lg:gap-4 xl:flex-row xl:pr-0"
      >
        <KitaListView />
        {height > 0 && <KitaMapView height={height} />}
      </div>
    </div>
  );
};

export default KitaFinderDesktopView;
