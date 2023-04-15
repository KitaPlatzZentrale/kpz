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
  inputProps?: InputProps & { helperText?: string };
  formControlProps?: FormControlProps;
} & AutocompleteProps<string, false, false, false>;

const FormAutocomplete: React.FC<FormAutocompleteProps> = ({
  label,
  options,
  placeholder,
  inputProps,
  formControlProps,
  ...autoCompleteProps
}) => {
  const { error, helperText, ...rest } = inputProps || {};

  return (
    <FormControl error={error} {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Autocomplete
        options={options}
        placeholder={placeholder}
        slotProps={{
          input: {
            ...rest,
          },
        }}
        {...autoCompleteProps}
      />
      {helperText && (
        <FormHelperText color="primary">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormAutocomplete;
