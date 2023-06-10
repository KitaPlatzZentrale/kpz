import { DateRange, Search } from "@mui/icons-material";
import { Button, ModalClose } from "@mui/joy";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import AddressLookup from "../../../../components/AddressLookup";
import FormAutocomplete from "../../../../components/FormAutocomplete";
import { useKitaListContext } from "../../common/KitaDataContext";
import { useSearchContext } from "../../common/KitaSearchContext";
import MobileOverlay from "../../../../components/MobileOverlay/MobileOverlay";
import { useMobileOverlay } from "../../../../components/MobileOverlay/MobileOverlayContext";

type SearchOverlayProps = {
  onClose?: () => void;
};

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const {
    setCoordinates,
    setAddress,
    desiredStartingMonth,
    setDesiredStartingMonth,
    coordinatesAreValid,
    submit,
    submitted,
  } = useSearchContext();

  const { isFetching } = useKitaListContext();

  const { isOpen, setOpen } = useMobileOverlay("kita-search");

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleSubmit = async () => {
    await submit();
    handleClose();
  };

  const commonHorizontalPadding = "px-4";
  return (
    <MobileOverlay name="kita-search">
      <div
        className={clsx(
          "flex w-full flex-col gap-7 py-3",
          commonHorizontalPadding
        )}
      >
        <motion.h2 className="text-3xl font-black">
          Kitas in der Nähe finden
        </motion.h2>
        <div className="flex w-full flex-col">
          <motion.h3
            initial={{ x: -0 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, bounce: 0 }}
            className="mb-2 text-xl font-bold"
          >
            Wo wohnen Sie?
          </motion.h3>
          <AddressLookup
            label=""
            className="lg:w-full"
            onAddressSelected={async (address) => {
              setAddress(address);
            }}
            onCoordinatesSuccessfullyRetrieved={async (coordinates) => {
              if (coordinates.lat == null || coordinates.lng == null) return;

              setCoordinates(coordinates);
            }}
          />
        </div>
        <div className="flex w-full flex-col">
          <motion.h3
            initial={{ x: -0 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, bounce: 0 }}
            className="mb-2 text-xl font-bold"
          >
            Gewünschter Beginn
          </motion.h3>
          <FormAutocomplete
            formControlProps={{
              className: "w-full lg:w-1/4",
            }}
            label=""
            placeholder="z.B. Mai 2023"
            startDecorator={<DateRange />}
            value={desiredStartingMonth}
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
            defaultValue={desiredStartingMonth}
            onChange={(event, value) => {
              setDesiredStartingMonth(value);
            }}
          />
        </div>
      </div>
      <div
        className={clsx(
          "absolute bottom-0 flex w-full flex-row-reverse bg-slate-100 py-3",
          commonHorizontalPadding
        )}
      >
        <Button
          style={{ padding: "16px 32px" }}
          color="info"
          startDecorator={<Search />}
          size="lg"
          variant="solid"
          loading={isFetching}
          loadingPosition="center"
          disabled={
            submitted ? !coordinatesAreValid || !desiredStartingMonth : false
          }
          onClick={async () => await handleSubmit()}
        >
          Kitas finden
        </Button>
      </div>
    </MobileOverlay>
  );
};

export default SearchOverlay;
