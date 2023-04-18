import {
  Check,
  Close,
  DirectionsWalk,
  NotificationsOutlined,
  OpenInNew,
} from "@mui/icons-material";
import { Button, Chip, Link } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import EmailSubmitModal from "../../../../components/EmailSubmitModal";
import { useSearchContext } from "../../../../components/SearchContext";
import { Kita } from "../../../../types";

import Balancer from "react-wrap-balancer";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../../tailwind.config";

const screenIsBiggerOrEqualToMd = () => {
  const { theme } = resolveConfig(tailwindConfig);
  const screens = theme.extend ? theme.extend.screens : { md: "768px" };
  return window.innerWidth >= screens.md;
};

// e.g. turn "August 2023" into "2023-08-01", day is always 01
// ist nicht schön aber wat soll's
const transformMonthIntoISODate = (month: string | null) => {
  if (!month || month.length === 0) return null;

  const monthToNumber = {
    Januar: "01",
    Februar: "02",
    März: "03",
    April: "04",
    Mai: "05",
    Juni: "06",
    Juli: "07",
    August: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Dezember: "12",
  };

  const [monthName, year] = month.split(" ");
  const monthNumber = monthToNumber[monthName];

  return `${year}-${monthNumber}-01`;
};

type KitaListItemProps = {
  kita: Kita;
};

const KitaListItem: React.FC<KitaListItemProps> = ({ kita }) => {
  const { desiredStartingMonth } = useSearchContext();

  const [validStartingMonth, setValidStartingMonth] =
    React.useState(desiredStartingMonth);

  const desiredStartingMonthISODate =
    transformMonthIntoISODate(validStartingMonth);

  const hasSlotsFreeInSelectedMonth = desiredStartingMonthISODate
    ? kita.availability[desiredStartingMonthISODate]
    : false;

  const [openModal, setOpenModal] = React.useState(false);

  React.useEffect(() => {
    if (!desiredStartingMonth) return;
    if (desiredStartingMonth.length === 0) return;
    setValidStartingMonth(desiredStartingMonth);
  }, [desiredStartingMonth]);

  return (
    <div
      key={"kita" + kita.uuid}
      className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 sm:p-9 lg:flex-row lg:p-6"
    >
      <EmailSubmitModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex flex-col">
        <img
          src={kita.imageUrl}
          style={{
            objectFit: "cover",
          }}
          alt="Kita Logo"
          className="min-w-full rounded-lg md:w-24 lg:h-24"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href={`https://kita-navigator.berlin.de/einrichtungen/${kita.uuid}`}
          sx={(theme) => ({
            color: theme.palette.neutral[900],
            textDecorationColor: theme.palette.neutral[200],
            ":hover": {
              color: theme.palette.info[800],
            },
          })}
          component="a"
          className="text-xl font-extrabold underline-offset-4"
          fontSize={20}
          underline="always"
        >
          <Balancer>{kita.name}</Balancer>
        </Link>
        <div className="mb-4 flex flex-row items-center gap-3">
          <span className="text-bl text-sm font-bold text-deep-blue">{`${kita.address.street} ${kita.address.houseNumber}, ${kita.address.zip}`}</span>
          <Chip
            startDecorator={<DirectionsWalk />}
            color="neutral"
            variant="soft"
            size="sm"
          >
            <span className="px-2 font-bold">{`${
              /** Round coordinates.dist to 2 floating points */
              Math.round(kita.coordinates.dist * 100) / 100
            }km`}</span>
          </Chip>
        </div>
        <div className="flex flex-row items-center text-sm">
          <span
            className={clsx(
              "font-bold",
              hasSlotsFreeInSelectedMonth ? "text-gray-500" : "text-gray-500"
            )}
          >
            {validStartingMonth}:
          </span>
          <div className="ml-1 ">
            {hasSlotsFreeInSelectedMonth ? (
              <div className="flex flex-row items-center  gap-1 text-sm font-bold text-green-600">
                Plätze frei
                <Check />
              </div>
            ) : (
              <div
                color="danger"
                className="flex flex-row items-center  gap-1 text-sm font-bold text-red-600"
              >
                Ausgebucht
                <Close />
              </div>
            )}
          </div>
        </div>
        {!hasSlotsFreeInSelectedMonth && (
          <>
            <Button
              color="info"
              variant="plain"
              size="sm"
              onClick={() => setOpenModal(true)}
              sx={(theme) => ({
                padding: 0,
                justifyContent: "flex-start",
                width: "fit-content",
              })}
              startDecorator={<NotificationsOutlined />}
            >
              <span className="underline underline-offset-2">
                Erhalte Benachrichtigungen
              </span>
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-col md:ml-auto">
        <Button
          color="info"
          variant="outlined"
          size={screenIsBiggerOrEqualToMd() ? "sm" : "md"}
          href={`https://kita-navigator.berlin.de/einrichtungen/${kita.uuid}`}
          onClick={() => {
            window.open(
              `https://kita-navigator.berlin.de/einrichtungen/${kita.uuid}`,
              "_blank"
            );
          }}
          target="_blank"
          sx={(theme) => ({
            paddingTop: 1,
            paddingBottom: 1,
            paddingLeft: 2,
            paddingRight: 2,
            borderRadius: 4,
          })}
          endDecorator={<OpenInNew />}
        >
          Details ansehen
        </Button>
      </div>
    </div>
  );
};

export const KitaListItemSkeleton: React.FC<{ index?: number }> = ({
  index = 0,
}) => {
  return (
    <div
      key={"kitaskeleton" + index}
      className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 sm:p-9 lg:flex-row lg:p-6"
    >
      <div className="flex flex-col">
        <div className="min-w-full animate-pulse rounded-lg bg-gray-100 md:w-24 lg:h-24" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-6 w-64 animate-pulse bg-gray-100 text-xl font-extrabold underline-offset-4" />
        <div className="mb-4 flex flex-row items-center gap-3">
          <div className="text-bl h-6 w-64 animate-pulse bg-gray-100 text-sm font-bold text-deep-blue" />
        </div>
        <div className="flex flex-row items-center text-sm">
          <div className="h-6 w-32 animate-pulse bg-gray-100 font-bold" />
          <div className="ml-1 h-6 w-32 animate-pulse bg-gray-100" />
        </div>
      </div>
      <div className="flex flex-col md:ml-auto">
        <div className="h-6 w-32 animate-pulse bg-gray-100" />
      </div>
    </div>
  );
};

export default KitaListItem;
