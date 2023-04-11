import {
  Close,
  CloseOutlined,
  DirectionsWalk,
  NotificationsOutlined,
  OpenInNew,
} from "@mui/icons-material";
import { Button, Chip, Link, Typography } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import EmailSubmitModal from "../../../../components/EmailSubmitModal";
import { Kita } from "../../../../types";

type KitaListItemProps = {
  kita: Kita;
};

const KitaListItem: React.FC<KitaListItemProps> = ({ kita }) => {
  const month = "Mai 2024";

  const hasSlotsFreeInSelectedMonth = !!kita.availability[month];

  const [openModal, setOpenModal] = React.useState(false);

  return (
    <div
      key={"kita" + kita.uuid}
      className="flex w-full flex-row gap-6 rounded-2xl bg-white p-6"
    >
      <EmailSubmitModal open={openModal} onClose={() => setOpenModal(false)} />
      <div className="flex flex-col" style={{ maxHeight: 100, width: 100 }}>
        <img
          src={kita.imageUrl}
          style={{
            objectFit: "cover",
            height: 100,
            maxWidth: 100,
            minWidth: 100,
          }}
          alt="Kita Logo"
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Link
          href={`/finder/${kita.uuid}`}
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
          {kita.name}
        </Link>
        <div className="mb-4 flex flex-row items-center gap-3">
          <span className="text-bl text-sm font-bold text-deep-blue">{`${kita.address.street} ${kita.address.houseNumber}, ${kita.address.zip}`}</span>
          <Chip
            startDecorator={<DirectionsWalk />}
            color="neutral"
            variant="soft"
            size="sm"
          >
            <span className="px-2 font-bold">{`${kita.coordinates.dist}km`}</span>
          </Chip>
        </div>
        <div className="flex flex-row items-center text-sm">
          <span
            className={clsx(
              "font-bold",
              hasSlotsFreeInSelectedMonth ? "text-gray-500" : "text-gray-500"
            )}
          >
            {month}:
          </span>
          <div className="ml-1 ">
            {hasSlotsFreeInSelectedMonth ? (
              <div className="flex flex-row gap-1 text-green-600">
                <span>Available</span>
                <span>Check</span>
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
      <div className="ml-auto flex flex-col">
        <Button
          color="info"
          variant="outlined"
          size="sm"
          href={`/finder/${kita.uuid}`}
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

export default KitaListItem;
