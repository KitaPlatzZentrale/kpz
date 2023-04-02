import { Button, Chip } from "@mui/joy";
import clsx from "clsx";
import React from "react";
import { Kita } from "../../../../types";

type KitaListItemProps = {
  kita: Kita;
};

const KitaListItem: React.FC<KitaListItemProps> = ({ kita }) => {
  const month = "Mai 2024";

  const hasSlotsFreeInSelectedMonth = !!kita.availability[month];

  return (
    <div
      key={"kita" + kita.uuid}
      className="flex w-full flex-row gap-6 rounded-2xl bg-white p-6"
    >
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
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-extrabold underline underline-offset-4">
          {kita.name}
        </h3>
        <div className="mb-4 flex flex-row gap-2">
          <span className="font-bold text-gray-600">{`${kita.address.street} ${kita.address.houseNumber}, ${kita.address.zip}`}</span>
          <Chip size="sm">
            <span className="px-2 font-bold">{`${kita.coordinates.dist}km`}</span>
          </Chip>
        </div>
        <div className="flex flex-row">
          <span
            className={clsx(
              "font-bold",
              hasSlotsFreeInSelectedMonth ? "text-gray-600" : "text-gray-400"
            )}
          >
            {month}:
          </span>
          <div className="ml-1">
            {hasSlotsFreeInSelectedMonth ? (
              <div className="flex flex-row gap-1 text-green-600">
                <span>Available</span>
                <span>Check</span>
              </div>
            ) : (
              <div className="flex flex-row gap-1 text-gray-400">
                <span>Not available</span>
                <span>Cross</span>
              </div>
            )}
          </div>
        </div>
        {!hasSlotsFreeInSelectedMonth && (
          <div className="mt-1 flex flex-row items-center gap-2 text-sm">
            Bell
            <span className="font-bold text-blue-600">
              Notify me when available
            </span>
          </div>
        )}
      </div>
      <div className="ml-auto flex flex-col">
        <Button color="info" variant="outlined">
          View details
        </Button>
      </div>
    </div>
  );
};

export default KitaListItem;
