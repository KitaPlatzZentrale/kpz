import { DateRange } from "@mui/icons-material";
import { Button } from "@mui/joy";
import React from "react";
import EmailSubmitModal from "../../components/EmailSubmitModal";
import FormAutocomplete from "../../components/FormAutocomplete";
import SearchContextProvider from "../../components/SearchContext";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import { Kita } from "../../types";
import Layout from "../layout";
import AddressLookup from "./components/AddressLookup";
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
            <div className="flex h-full w-full flex-col">
              <ServiceBanner />
              <Search />

              <div
                id="content"
                className="flex h-full w-full flex-row items-stretch"
              >
                <div
                  id="results-list"
                  className="flex w-3/5 flex-grow flex-col p-24"
                >
                  <KitaList />
                </div>
                {/* <div id="map" className="flex  flex-grow bg-blue-300"></div> */}
              </div>
            </div>
          </ServiceSignupModalContextProvider>
        </SearchContextProvider>
      </KitaListContextProvider>
    </Layout>
  );
};

export default FinderPage;
