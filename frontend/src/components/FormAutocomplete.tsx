import {
  Autocomplete,
  FormControl,
  FormControlProps,
  FormLabel,
} from "@mui/joy";
import React from "react";

type FormAutocompleteProps = {
  label: string;
  options: string[];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<{}>, value: string | null) => void;
  inputProps?: any;
} & FormControlProps;

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  options,
  placeholder,
  onChange,
  inputProps,
  ...formControlProps
}) => {
  return (
    <FormControl {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Autocomplete
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        {...inputProps}
      />
    </FormControl>
  );
};

export default FormAutocomplete;
