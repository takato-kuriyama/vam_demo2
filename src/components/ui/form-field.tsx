import React from "react";
import { Label } from "./label";
import { Input } from "./input";

interface FormFieldProps {
  id: string;
  label: string;
  children?: React.ReactNode;
  labelClassName?: string;
  error?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  children,
  labelClassName = "",
  error,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={labelClassName}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const InputField = ({
  id,
  label,
  error,
  required,
  labelClassName,
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <FormField
      id={id}
      label={label}
      error={error}
      required={required}
      labelClassName={labelClassName}
    >
      <Input id={id} {...props} required={required} />
    </FormField>
  );
};
