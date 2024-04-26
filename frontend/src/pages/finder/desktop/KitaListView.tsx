import React from "react";
import { useKitaListContext } from "../common/KitaDataContext";
import { useKitaListScrollContext } from "./components/KitaList/KitaListScrollContext";
import { useSearchContext } from "../common/KitaSearchContext";

import KitaList from "./components/KitaList/KitaList";
import { AnimatePresence, motion } from "framer-motion";
import { KitaListItemSkeleton } from "./components/KitaList/KitaListItem";

type KitaListViewProps = React.PropsWithChildren<{}>;

const MotionDiv = ({ children, ...props }) => {
  return (
    <motion.div
      className="flex w-full items-center justify-center rounded-lg bg-slate-200 py-8"
      {...props}
    >
      <span className="text-left w-96">{children}</span>
    </motion.div>
  );
};


const StartKitaSearchListView = () => {
  return (
    <AnimatePresence>
      <div className="flex w-full flex-col">
        <motion.div
          className="mb-20 mt-6"
          key="start-search-information"
          exit={{ height: 0, margin: 0 }}
        >
          <h3 className="mb-3 text-3xl font-black">
            Starten Sie mit uns Ihre Suche
          </h3>
          <p className="text-base font-medium">
            Entdecken Sie mit unserer innovativen Web-Applikation spielend
            leicht die 50 nächstgelegenen Kindergärten basierend auf Ihrer
            Adresse, sortiert nach Entfernung. Verfolgen Sie mühelos den
            Verfügbarkeitsstatus der Einrichtungen gemäß berlin.de. Und falls
            Ihre Wunsch-Kita keinen Platz hat, können Sie sich für
            Benachrichtigungen über neu verfügbare Plätze eintragen.
            <br />
            <br />
            Kitaplatz, Kinderleicht.
          </p>
          <h5 className="mb-2 mt-8 text-sm font-black uppercase">So geht's</h5>
          <div className="flex flex-col gap-2">
            <MotionDiv
              key="start-search-information-step-1"
              transition={{ type: "spring", bounce: 0 }}
              initial={{ opacity: 0, x: -75 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -75 }}
            >
              1. Geben Sie Ihre Adresse ein
            </MotionDiv>
            <MotionDiv
              key="start-search-information-step-2"
              transition={{ type: "spring", bounce: 0 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              2. Wählen Sie den Start-Monat aus
            </MotionDiv>
            <MotionDiv
              key="start-search-information-step-3"
              transition={{ type: "spring", bounce: 0 }}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
            >
              3. Erhalten Sie eine Liste von Kitas in Ihrer Nähe
            </MotionDiv>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const KitaListView: React.FC<KitaListViewProps> = ({ children }) => {
  const { kitas } = useKitaListContext();
  const { listRef } = useKitaListScrollContext();

  const { submitted } = useSearchContext();

  const noSearchHasStarted = !submitted;
  const noKitasFoundYet = !kitas || kitas?.length === 0;

  return (
    <div className="xs:page-padding sm:page-padding md:page-padding lg:page-padding absolute z-50 flex h-full w-full flex-col rounded-t-xl px-5 py-8 lg:relative lg:z-0 lg:max-w-[900px] xl:w-1/2 xl:pl-0 xl:pr-6">
      <AnimatePresence>
        {noSearchHasStarted && (
          <motion.div
            key="start-search-information-container"
            transition={{ type: "spring", bounce: "0" }}
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <StartKitaSearchListView />
          </motion.div>
        )}
        <motion.div
          key="desktop-kita-list"
          ref={listRef}
          className="flex flex-col gap-2 overflow-y-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            bounce: 0,
            delay: 0.1,
          }}
        >
          <AnimatePresence>
            {noKitasFoundYet ? (
              <motion.div
                key="start-search-information-skeletons"
                className="flex w-full flex-col items-start gap-2"
                style={{ overflow: "hidden" }}
              >
                {!noSearchHasStarted && (
                  <motion.div
                    key="start-search-information-skeleton-headline"
                    transition={{
                      type: "spring",
                      bounce: 0,
                    }}
                    initial={{ opacity: 0, x: -100, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: -100, height: "auto" }}
                    className="w-full"
                  >
                    <div className="mb-2 mt-2 h-7 w-1/2 animate-pulse bg-slate-200" />
                    <div className="mb-4 h-5 w-2/3 animate-pulse bg-slate-200" />
                  </motion.div>
                )}
                {[0.95, 0.6, 0.3, 0.15, 0.05, 0.05, 0.05, 0.05, 0.05].map(
                  (opacity, index) => (
                    <motion.div
                      key={`start-search-information-skeleton-${index}`}
                      transition={{
                        type: "spring",
                        delay: index * 0.05,
                        bounce: 0,
                      }}
                      initial={{ opacity: 0, y: 200 }}
                      animate={{
                        y: 0,
                        opacity: noSearchHasStarted ? opacity : 1,
                      }}
                      className="w-full"
                    >
                      <KitaListItemSkeleton animate={!noSearchHasStarted} />
                    </motion.div>
                  )
                )}
              </motion.div>
            ) : (
              <motion.div
                key="desktop-kita-list-"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  type: "spring",
                  bounce: 0,
                }}
              >
                <div className="mb-4 flex flex-col gap-1">
                  <span className="text-xl font-extrabold text-gray-800">
                    {kitas?.length || 0} Einrichtungen in der Nähe
                  </span>
                  <span className="text-gray-500">
                    Informationen und Verfügbarkeiten nach{" "}
                    <a
                      className="font-bold text-happy-blue"
                      target="_blank"
                      href="https://berlin.de"
                    >
                      berlin.de
                    </a>
                  </span>
                </div>
                <div className="flex flex-row items-start">
                  <KitaList className="w-full" kitas={kitas} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default KitaListView;
