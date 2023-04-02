import { FormControl, FormLabel, FormLabelProps } from "@mui/joy";
import React from "react";

type LabelledInputProps = React.PropsWithChildren<{
  label: React.ReactNode | string;
}> &
  FormLabelProps;

const LabelledInput: React.FC<LabelledInputProps> = ({
  label,
  children,
  ...formLabelProps
}) => {
  return (
    <FormControl>
      <FormLabel {...formLabelProps}>{label}</FormLabel>
      {children}
    </FormControl>
  );
};

export default LabelledInput;
