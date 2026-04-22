import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  Input,
  InputProps,
} from "@mui/joy";
import React from "react";

type FormFieldProps = {
  label: string;
  inputProps?: Omit<InputProps, "defaultValue"> & {
    helperText?: string;
    defaultValue?: string | number | readonly string[] | null;
  };
} & FormControlProps;

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  onChange,
  inputProps,
  ...formControlProps
}) => {
  const { error, helperText, defaultValue, ...restInputProps } = inputProps || {};

  return (
    <FormControl error={error} {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Input placeholder={placeholder} defaultValue={defaultValue ?? undefined} {...restInputProps} />
      {helperText && (
        <FormHelperText color="primary">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormField;
