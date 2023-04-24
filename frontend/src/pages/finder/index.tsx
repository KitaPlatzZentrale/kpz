import React from "react";
import SearchContextProvider from "./components/SearchContext";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import Layout from "../layout";
import KitaListView from "./components/KitaList/KitaListView";
import KitaListContextProvider from "./components/KitaList/KitaListContext";
import Search from "./components/Search";
import KitaListScrollContextProvider from "./components/KitaList/KitaListScrollContext";
import KitaMapView from "./components/Map/KitaMapView";

type FinderPageProps = {};

const FinderPage: React.FC<FinderPageProps> = () => {
  const headerRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);

  // contentHeight should be the height of the viewport minus the height of the header minus the height of the searchbar

  const [contentHeight, setContentHeight] = React.useState<number>(0);

  React.useEffect(() => {
    const headerHeight = headerRef.current?.clientHeight ?? 125;
    const searchHeight = searchRef.current?.clientHeight ?? 250;

    setContentHeight(window.innerHeight - headerHeight);
  }, [window.innerHeight, headerRef, searchRef]);

  return (
    <Layout headerRef={headerRef} lockAtScreenHeight>
      <KitaListScrollContextProvider>
        <KitaListContextProvider>
          <SearchContextProvider>
            <ServiceSignupModalContextProvider>
              <ServiceSignupModal />
              <div className="flex h-full w-full flex-col lg:pb-10">
                {/*<Search rootRef={searchRef} id="kita-searchbar" />*/}

                <div
                  id="content"
                  style={{ height: contentHeight }}
                  className="xl:page-padding flex w-full flex-col-reverse lg:gap-4 xl:flex-row xl:pr-0"
                >
                  <KitaListView />
                  <KitaMapView />
                </div>
              </div>
            </ServiceSignupModalContextProvider>
          </SearchContextProvider>
        </KitaListContextProvider>
      </KitaListScrollContextProvider>
    </Layout>
  );
};

export default FinderPage;
