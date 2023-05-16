import { Button } from "@mui/joy";
import React from "react";
import { Link } from "react-router-dom";
import Layout from "./layout";

import Balancer from "react-wrap-balancer";

type FourOhFourPageProps = {};

const FourOhFourPage: React.FC<FourOhFourPageProps> = ({}) => {
  return (
    <Layout>
      <div className="page-padding flex h-screen flex-col-reverse items-center justify-center gap-0 py-24 md:gap-28 md:py-20 lg:flex-row lg:py-24">
        <div className="relative w-full pb-12 lg:pb-0 xl:w-1/2 xl:pt-0">
          <div className="relative">
            <div>
              <div className="flex flex-col">
                <h1 className="my-2 text-5xl font-extrabold text-gray-800">
                  Seite nicht gefunden
                </h1>
                <Balancer className="my-3 w-2/3 text-lg font-medium text-gray-700">
                  Sollte hier etwas zu finden sein, melden Sie dies bitte an{" "}
                  <a
                    className="font-semibold text-happy-blue"
                    href="mailto:hallo@kitaplatz-zentrale.de"
                  >
                    hallo@kitaplatz-zentrale.de
                  </a>
                </Balancer>
                <Link to="/">
                  <Button
                    size="lg"
                    sx={{ marginTop: 2, padding: "1.25rem 2rem" }}
                    variant="solid"
                  >
                    Zurück zur Startseite
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-[10rem] font-black text-happy-blue text-opacity-20 md:text-[12rem] lg:text-[16rem]">
            404
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default FourOhFourPage;
