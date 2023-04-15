import React from "react";
import CentricContent from "../../components/CentricContent";
import SearchContextProvider from "../../components/SearchContext";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import Layout from "../layout";
import KitaList from "./components/KitaList/KitaList";
import KitaListContextProvider from "./components/KitaListContext";
import Search from "./components/Search";
import ServiceBanner from "./components/ServiceBanner";

type FinderPageProps = {};

const FinderPage: React.FC<FinderPageProps> = () => {
  return (
    <Layout>
      <KitaListContextProvider>
        <SearchContextProvider>
          <ServiceSignupModalContextProvider>
            <ServiceSignupModal />
            <div className="flex h-full w-full flex-col py-10">
              <CentricContent>
                <ServiceBanner />
              </CentricContent>
              <Search />

              <div
                id="content"
                className="flex h-full w-full flex-row items-stretch"
              >
                <CentricContent>
                  <div
                    id="results-list"
                    className="flex w-full flex-grow flex-col py-8"
                  >
                    <KitaList />
                  </div>
                </CentricContent>
              </div>
            </div>
          </ServiceSignupModalContextProvider>
        </SearchContextProvider>
      </KitaListContextProvider>
    </Layout>
  );
};

export default FinderPage;
