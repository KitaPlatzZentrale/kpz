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
  inputProps?: InputProps & { helperText?: string };
} & FormControlProps;

const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  onChange,
  inputProps,
  ...formControlProps
}) => {
  const { error, helperText } = inputProps || {};

  return (
    <FormControl error={error} {...formControlProps}>
      <FormLabel>{label}</FormLabel>
      <Input placeholder={placeholder} {...inputProps} />
      {helperText && (
        <FormHelperText color="primary">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FormField;
