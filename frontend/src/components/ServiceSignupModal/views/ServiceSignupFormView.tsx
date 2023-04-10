import React from "react";
import { Cake, DateRange, MailOutline } from "@mui/icons-material";
import { Button, Divider } from "@mui/joy";

import AddressLookup from "../../../pages/finder/components/AddressLookup";
import FormAutocomplete from "../../FormAutocomplete";
import FormField from "../../FormField";
import { useServiceSignupFormContext } from "../ServiceSignupFormContext";

import { useWizardContext } from "../WizardContext";
import { DevTool } from "@hookform/devtools";

type ServiceSignupFormViewProps = {};

const ServiceSignupFormView: React.FC<ServiceSignupFormViewProps> = () => {
  const { goToPrevious } = useWizardContext();
  const { register, handleSubmit, isLoading, control } =
    useServiceSignupFormContext();

  return (
    <>
      <div className="mb-8 flex w-full flex-col">
        <h3 className="mb-2 text-2xl font-black">Wo sollen wir suchen?</h3>
        <p className="w-full text-base text-gray-800">
          Mit Ihren Angaben gleichen wir die Angebote der naheliegenden Kitas
          ab. Diese Daten verlassen dabei niemals unsere Server.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <DevTool control={control} />
        <AddressLookup className="mb-6 w-full" />
        <div className="mb-6 flex flex-row flex-wrap items-start gap-6">
          <FormAutocomplete
            className="w-1/3 flex-auto"
            label="Gewünschter Beginn"
            placeholder="z.B. Mai 2023"
            inputProps={{
              startDecorator: <DateRange />,
              ...register("desiredStartMonth"),
              disabled: isLoading,
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
          <FormAutocomplete
            className="w-1/3 flex-auto"
            label="Geburtsmonats des Kindes"
            placeholder="z.B. Juni 2022"
            inputProps={{
              startDecorator: <Cake />,
              ...register("expectedBirthDate"),
              disabled: isLoading,
            }}
            options={[
              "Januar 2020",
              "Februar 2020",
              "März 2020",
              "April 2020",
              "Mai 2020",
              "Juni 2020",
              "Juli 2020",
              "August 2020",
              "September 2020",
              "Oktober 2020",
              "November 2020",
              "Dezember 2020",
              "Januar 2021",
              "Februar 2021",
              "März 2021",
              "April 2021",
              "Mai 2021",
              "Juni 2021",
              "Juli 2021",
              "August 2021",
              "September 2021",
              "Oktober 2021",
              "November 2021",
              "Dezember 2021",
              "Januar 2022",
              "Februar 2022",
              "März 2022",
              "April 2022",
              "Mai 2022",
              "Juni 2022",
              "Juli 2022",
              "August 2022",
              "September 2022",
              "Oktober 2022",
              "November 2022",
              "Dezember 2022",
              "Januar 2023",
              "Februar 2023",
              "März 2023",
              "April 2023",
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
              "Mai 2025",
              "Juni 2025",
              "Juli 2025",
              "August 2025",
              "September 2025",
              "Oktober 2025",
              "November 2025",
              "Dezember 2025",
              "Januar 2026",
              "Februar 2026",
              "März 2026",
              "April 2026",
              "Mai 2026",
              "Juni 2026",
              "Juli 2026",
              "August 2026",
              "September 2026",
              "Oktober 2026",
              "November 2026",
              "Dezember 2026",
            ]}
          />
        </div>
        <Divider role="separator" />
        <FormField
          inputProps={{
            startDecorator: <MailOutline />,
            ...register("email"),
            autoComplete: "email",
            disabled: isLoading,
          }}
          label="Email Adresse"
          placeholder="Ihre Email Adresse"
          className="pt-6"
        />
        <div className="mb-4 mt-8 flex flex-row justify-end gap-3">
          <Button
            variant="outlined"
            color="neutral"
            size="lg"
            onClick={goToPrevious}
            disabled={isLoading}
          >
            Zurück
          </Button>
          <Button
            loading={isLoading}
            type="submit"
            variant="solid"
            color="primary"
            size="lg"
          >
            Unverbindlich Anmelden
          </Button>
        </div>
      </form>
    </>
  );
};

export default ServiceSignupFormView;
