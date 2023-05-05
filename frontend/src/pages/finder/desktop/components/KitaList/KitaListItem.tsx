import React from "react";
import { useSearchContext } from "../../../common/KitaSearchContext";

import clsx from "clsx";
import Balancer from "react-wrap-balancer";
import {
  getDescribedHaversineDistanceBetweenCoordinates,
  screenIsBiggerOrEqualToMd,
  transformMonthIntoISODate,
} from "../../../common/utils";

import {
  Check,
  Close,
  DirectionsWalk,
  NotificationsOutlined,
  OpenInNew,
} from "@mui/icons-material";
import { Button, Chip, Link } from "@mui/joy";

import EmailSubmitModal from "../../../../../components/EmailSubmitModal";

import type { Kita } from "../../../../../types";

type KitaListItemProps = {
  kita: Kita;
  id?: string;
};

const KitaListItem: React.FC<KitaListItemProps> = ({ kita, id }) => {
  const { desiredStartingMonth, coordinates: currentSearchCoordinates } =
    useSearchContext();

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
      id={id}
      className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 pl-8 shadow-lg sm:p-9 sm:pl-12 lg:flex-row lg:p-6 lg:pl-9 lg:shadow-none"
    >
      <EmailSubmitModal open={openModal} onClose={() => setOpenModal(false)} />
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
              //Math.round(kita.location.coordinates.dist * 100) / 100
              getDescribedHaversineDistanceBetweenCoordinates(
                {
                  lng: kita.location.coordinates[0],
                  lat: kita.location.coordinates[1],
                },
                currentSearchCoordinates
              )
            }`}</span>
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

export const KitaListItemSkeleton: React.FC<{
  index?: number;
  className?: string;
  animate?: boolean;
}> = ({ className, animate = true, index = 0 }) => {
  return (
    <div
      key={"kitaskeleton" + index}
      className={clsx(
        "flex w-full flex-col gap-6 rounded-2xl bg-white p-6 pl-9 sm:p-9 sm:pl-12 lg:flex-row lg:p-6 lg:pl-9",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <div
          className={clsx(
            animate && "animate-pulse",
            "h-6 w-64 bg-gray-100 text-xl font-extrabold underline-offset-4"
          )}
        />
        <div className="mb-4 flex flex-row items-center gap-3">
          <div
            className={clsx(
              animate && "animate-pulse",
              "text-bl h-6 w-64 bg-gray-100 text-sm font-bold text-deep-blue"
            )}
          />
        </div>
        <div className="flex flex-row items-center text-sm">
          <div
            className={clsx(
              animate && "animate-pulse",
              "h-6 w-32 bg-gray-100 font-bold"
            )}
          />
          <div
            className={clsx(
              animate && "animate-pulse",
              "ml-1 h-6 w-32 bg-gray-100"
            )}
          />
        </div>
      </div>
      <div className="flex flex-col md:ml-auto">
        <div
          className={clsx(animate && "animate-pulse", "h-6 w-32 bg-gray-100")}
        />
      </div>
    </div>
  );
};

export default KitaListItem;
