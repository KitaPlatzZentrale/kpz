import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  InputProps,
} from "@mui/joy";
import React from "react";

type FormAutocompleteProps = {
  label: string;
  options: string[];
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<{}>, value: string | null) => void;
  inputProps?: InputProps & { helperText?: string };
} & FormControlProps;

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  options,
  placeholder,
  onChange,
  inputProps,
  ...formControlProps
}) => {
  const { error, helperText, ...rest } = inputProps || {};

  return (
    <FormControl error={error} {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Autocomplete options={options} placeholder={placeholder} {...rest} />
      {helperText && (
        <FormHelperText color="primary">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormAutocomplete;
