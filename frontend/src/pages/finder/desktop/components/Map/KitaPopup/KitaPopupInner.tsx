import React from "react";
import { useSearchContext } from "../../../../common/KitaSearchContext";

import clsx from "clsx";
import {
  getDescribedHaversineDistanceBetweenCoordinates,
  transformMonthIntoISODate,
} from "../../../../common/utils";
import Balancer from "react-wrap-balancer";

import {
  Check,
  Close,
  DirectionsWalk,
  NotificationsOutlined,
} from "@mui/icons-material";
import { Chip, IconButton, Link, ModalClose } from "@mui/joy";

import EmailSubmitModal from "../../../../../../components/EmailSubmitModal";

import type { Kita } from "../../../../../../types";

type KitaPopupInnerProps = {
  kita: Kita;
  onClose?: () => void;
};

export const KitaPopupInner: React.FC<KitaPopupInnerProps> = ({
  kita,
  onClose,
}) => {
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
      className="relative -m-2.5 flex w-full min-w-[300px] cursor-pointer flex-col gap-3 rounded-2xl bg-white p-0 pb-3"
    >
      <div className="absolute bottom-2 right-3 z-10 opacity-100">
        <IconButton
          color="info"
          variant="soft"
          size="sm"
          onClick={() => setOpenModal(true)}
        >
          <NotificationsOutlined />
        </IconButton>
      </div>
      <div
        className="absolute -right-4 -top-4 z-20"
        onClick={() => onClose?.()}
      >
        <ModalClose variant="solid" size="sm" />
      </div>
      <EmailSubmitModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex flex-col">
        <img
          src={kita.imageUrl}
          style={{
            objectFit: "cover",
          }}
          alt="Kita Logo"
          className="min-w-full brightness-90 transition-all ease-in-out hover:brightness-100 md:w-24"
          onClick={() =>
            window.open(
              `https://kita-navigator.berlin.de/einrichtungen/${kita.uuid}`,
              "_blank"
            )
          }
        />
      </div>
      <div
        className="flex flex-col gap-1 px-3"
        onClick={() =>
          window.open(
            `https://kita-navigator.berlin.de/einrichtungen/${kita.uuid}`,
            "_blank"
          )
        }
      >
        <Link
          sx={(theme) => ({
            color: theme.palette.neutral[900],
            textDecorationColor: theme.palette.neutral[200],
            ":hover": {
              color: theme.palette.info[800],
            },
          })}
          component="a"
          className="text-lg font-extrabold underline-offset-4"
          fontSize={15}
          underline="always"
        >
          <Balancer>{kita.name}</Balancer>
        </Link>
        <div className="mb-3 flex flex-row items-center gap-3">
          <span className="text-xs font-bold text-deep-blue">{`${kita.address.street} ${kita.address.houseNumber}, ${kita.address.zip}`}</span>
          <Chip
            startDecorator={<DirectionsWalk fontSize="small" />}
            color="neutral"
            variant="soft"
            size="sm"
          >
            <span className="pl-0 pr-1 font-bold">
              {getDescribedHaversineDistanceBetweenCoordinates(
                {
                  lat: kita.location.coordinates[1],
                  lng: kita.location.coordinates[0],
                },
                currentSearchCoordinates
              )}
            </span>
          </Chip>
        </div>
        <div className="flex flex-row items-center text-xs">
          <span
            className={clsx(
              "font-bold",
              hasSlotsFreeInSelectedMonth ? "text-gray-500" : "text-gray-500"
            )}
          >
            {validStartingMonth}:
          </span>
          <div className="ml-1">
            {hasSlotsFreeInSelectedMonth ? (
              <div className="flex flex-row items-center gap-1 text-xs font-bold text-green-600">
                Plätze frei
                <Check fontSize="small" />
              </div>
            ) : (
              <div
                color="danger"
                className="flex flex-row items-center gap-1 text-xs font-bold text-red-600"
              >
                Ausgebucht
                <Close fontSize="small" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitaPopupInner;
