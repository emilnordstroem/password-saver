import React from 'react';
import { Button as NextUIButton, ButtonProps as NextUIButtonProps } from '@nextui-org/react';

// Extend NextUI Button props with custom variants
type ButtonVariant = 'solid' | 'flat' | 'faded' | 'light' | 'bordered' | 'ghost' | 'shadow';
type ButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<NextUIButtonProps, 'color' | 'variant' | 'size' | 'radius'> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  isLoading?: boolean;
  isIconOnly?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

/**
 * Button - Reusable button component
 * Wrapper around NextUI Button with consistent defaults
 */
export function Button({
  variant = 'solid',
  color = 'default',
  size = 'md',
  children,
  isLoading = false,
  isIconOnly = false,
  startContent,
  endContent,
  ...props
}: ButtonProps) {
  return (
    <NextUIButton
      variant={variant}
      color={color}
      size={size}
      isLoading={isLoading}
      isIconOnly={isIconOnly}
      startContent={startContent}
      endContent={endContent}
      {...props}
    >
      {children}
    </NextUIButton>
  );
}

export default Button;
