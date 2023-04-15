import React from "react";
import CentricContent from "../../components/CentricContent";
import SearchContextProvider from "../../components/SearchContext";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import Layout from "../layout";
import KitaListView from "./components/KitaList/KitaListView";
import KitaListContextProvider from "./components/KitaListContext";
import Search from "./components/Search";

type FinderPageProps = {};

const FinderPage: React.FC<FinderPageProps> = () => {
  return (
    <Layout>
      <KitaListContextProvider>
        <SearchContextProvider>
          <ServiceSignupModalContextProvider>
            <ServiceSignupModal />
            <div className="flex h-full w-full flex-col pb-10">
              <Search />

              <CentricContent>
                <div id="content" className="flex h-full w-full flex-row">
                  <div
                    id="results-list"
                    className="flex w-full flex-grow flex-col py-8"
                  >
                    <KitaListView />
                  </div>
                </div>
              </CentricContent>
            </div>
          </ServiceSignupModalContextProvider>
        </SearchContextProvider>
      </KitaListContextProvider>
    </Layout>
  );
};

export default FinderPage;
