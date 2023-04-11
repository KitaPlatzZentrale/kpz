import { DateRange } from "@mui/icons-material";
import { Button } from "@mui/joy";
import React from "react";
import EmailSubmitModal from "../../components/EmailSubmitModal";
import FormAutocomplete from "../../components/FormAutocomplete";
import ServiceSignupModal from "../../components/ServiceSignupModal/ServiceSignupModal";
import ServiceSignupModalContextProvider from "../../components/ServiceSignupModal/ServiceSignupModalContext";
import { Kita } from "../../types";
import Layout from "../layout";
import AddressLookup from "./components/AddressLookup";
import KitaList from "./components/KitaList/KitaList";
import ServiceBanner from "./components/ServiceBanner";

type FinderPageProps = {};

const fetchResults = async (lat: number, lng: number): Promise<Kita[]> => {
  //return generateKitasAndDetails(10).kitas;

  const results = await fetch(`http://localhost:3000/kitas/${lat}/${lng}`);

  return results.json();
};

const FinderPage: React.FC<FinderPageProps> = () => {
  const [results, setResults] = React.useState<Kita[]>([]);

  React.useEffect(() => {
    fetchResults(52.520008, 13.404954).then((results) => {
      setResults(results);
    });
  }, []);

  return (
    <Layout>
      <ServiceSignupModalContextProvider openOnMount>
        <ServiceSignupModal />
        <div className="flex h-full w-full flex-col">
          <ServiceBanner />
          <div className="w-full bg-sunny-light px-24 pb-8 pt-10">
            <div className="flex w-full max-w-5xl flex-row items-end gap-6">
              <AddressLookup />
              <FormAutocomplete
                className="w-2/6"
                label="Gewünschter Beginn"
                placeholder="z.B. Mai 2023"
                inputProps={{
                  startDecorator: <DateRange />,
                }}
                options={[
                  "Mai 2023",
                  "Juni 2023",
                  "Juli 2023",
                  "August 2023",
                  "September 2023",
                  "Oktober 2023",
                  "November 2023",
                  "Dezember 2023",
                  "Januar 2024",
                  "Februar 2024",
                  "März 2024",
                  "April 2024",
                  "Mai 2024",
                  "Juni 2024",
                  "Juli 2024",
                  "August 2024",
                  "September 2024",
                  "Oktober 2024",
                  "November 2024",
                  "Dezember 2024",
                  "Januar 2025",
                  "Februar 2025",
                  "März 2025",
                  "April 2025",
                ]}
              />
              <Button
                className="w-1/6"
                color="primary"
                size="lg"
                variant="solid"
              >
                Kitas finden
              </Button>
            </div>
          </div>
          <div
            id="content"
            className="flex h-full w-full flex-row items-stretch"
          >
            <div
              id="results-list"
              className="flex w-3/5 flex-grow flex-col p-24"
            >
              <KitaList kitas={results} />
            </div>
            {/* <div id="map" className="flex  flex-grow bg-blue-300"></div> */}
          </div>
        </div>
      </ServiceSignupModalContextProvider>
    </Layout>
  );
};

export default FinderPage;
