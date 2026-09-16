import React from 'react';
import { Input as NextUIInput, InputProps as NextUIInputProps } from '@nextui-org/react';

type InputType = 'text' | 'password' | 'email' | 'url' | 'number' | 'tel' | 'search';

interface InputProps extends Omit<NextUIInputProps, 'type' | 'size' | 'variant'> {
  type?: InputType;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

/**
 * Input - Reusable input component
 * Wrapper around NextUI Input with consistent defaults
 */
export function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  isInvalid = false,
  isRequired = false,
  isDisabled = false,
  isReadOnly = false,
  startContent,
  endContent,
  ...props
}: InputProps) {
  return (
    <NextUIInput
      type={type}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      startContent={startContent}
      endContent={endContent}
      {...props}
    />
  );
}

export default Input;
