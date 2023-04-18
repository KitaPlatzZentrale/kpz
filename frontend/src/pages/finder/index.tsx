import React from "react";
import SearchContextProvider from "../../components/SearchContext";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import Layout from "../layout";
import KitaListView from "./components/KitaList/KitaListView";
import KitaListContextProvider from "./components/KitaListContext";
import HereMap from "./components/Map/HereMap";
import Search from "./components/Search";

type FinderPageProps = {};

const FinderPage: React.FC<FinderPageProps> = () => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);

  // contentHeight should be the height of the viewport minus the height of the header minus the height of the searchbar

  const [contentHeight, setContentHeight] = React.useState<number>(0);

  React.useEffect(() => {
    const headerHeight = headerRef.current?.clientHeight ?? 125;
    const searchHeight = searchRef.current?.clientHeight ?? 250;

    setContentHeight(window.innerHeight - headerHeight - searchHeight);
  }, [headerRef, searchRef]);

  return (
    <Layout headerRef={headerRef} lockAtScreenHeight>
      <KitaListContextProvider>
        <SearchContextProvider>
          <ServiceSignupModalContextProvider>
            <ServiceSignupModal />
            <div className="flex h-full w-full flex-col pb-10">
              <Search rootRef={searchRef} id="kita-searchbar" />

              <div
                id="content"
                style={{ height: contentHeight }}
                className="page-padding flex w-full flex-row gap-4 pr-0"
              >
                <div
                  id="results-list"
                  className="flex w-1/2 flex-col overflow-y-scroll py-8 pr-6"
                >
                  <KitaListView />
                </div>
                <div id="finder-map" className="flex w-full flex-grow">
                  <HereMap />
                </div>
              </div>
            </div>
          </ServiceSignupModalContextProvider>
        </SearchContextProvider>
      </KitaListContextProvider>
    </Layout>
  );
};

export default FinderPage;
