import React from "react";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import Layout from "../layout";
import KitaListContextProvider from "./common/KitaDataContext";
import KitaListScrollContextProvider from "./desktop/components/KitaList/KitaListScrollContext";
import SearchContextProvider from "./common/KitaSearchContext";
import KitaFinderDesktopView from "./desktop/KitaFinderDesktopView";
import { screenIsBiggerOrEqualToXl } from "./common/utils";
import KitaFinderMobileView from "./mobile/KitaFinderMobileView";

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

  const isMobile = React.useMemo(() => {
    return !screenIsBiggerOrEqualToXl();
  }, [window.innerWidth]);

  return (
    <Layout headerRef={headerRef}>
      <KitaListScrollContextProvider>
        <KitaListContextProvider>
          <SearchContextProvider>
            <ServiceSignupModalContextProvider>
              <ServiceSignupModal />
              {!isMobile ? (
                <KitaFinderDesktopView height={contentHeight} />
              ) : (
                <KitaFinderMobileView height={contentHeight} />
              )}
            </ServiceSignupModalContextProvider>
          </SearchContextProvider>
        </KitaListContextProvider>
      </KitaListScrollContextProvider>
    </Layout>
  );
};

export default FinderPage;
