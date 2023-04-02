import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  InputProps,
  TextField,
} from "@mui/joy";
import React from "react";

type FormFieldProps = {
  label: string;
  inputProps?: InputProps;
} & FormControlProps;

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  onChange,
  inputProps,
  ...formControlProps
}) => {
  return (
    <FormControl {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Input placeholder={placeholder} {...inputProps} />
    </FormControl>
  );
};

export default FormField;
