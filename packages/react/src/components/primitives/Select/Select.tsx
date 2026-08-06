// Copyright 2024 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix, bem} from '@thunderid/browser';
import {FC, SelectHTMLAttributes} from 'react';
import useStyles from './Select.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import {cx} from '../../../styles/emotion';
import FormControl from '../FormControl/FormControl';
import InputLabel from '../InputLabel/InputLabel';

export interface SelectOption {
  /**
   * The text that will be displayed in the select
   */
  label: string;
  /**
   * The value that will be submitted with the form
   */
  value: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Error message to display below the select
   */
  error?: string;
  /**
   * Helper text to display below the select
   */
  helperText?: string;
  /**
   * Label text to display above the select
   */
  label?: string;
  /**
   * The options to display in the select
   */
  options: SelectOption[];
  /**
   * Placeholder text for the default/empty option
   */
  placeholder?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
}

const Select: FC<SelectProps> = ({
  label,
  error,
  className,
  required,
  disabled,
  helperText,
  placeholder,
  options,
  style = {},
  ...rest
}: SelectProps) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const hasError = !!error;
  const styles: Record<string, string> = useStyles(theme, colorScheme, disabled ?? false, hasError);

  const selectClassName: string = cx(
    withVendorCSSClassPrefix(bem('select', 'input')),
    styles['select'],
    hasError && styles['selectError'],
    disabled && styles['selectDisabled'],
  );

  return (
    <FormControl
      error={error}
      helperText={helperText}
      className={cx(withVendorCSSClassPrefix(bem('select')), className)}
      style={style}
    >
      {label && (
        <InputLabel required={required} error={hasError}>
          {label}
        </InputLabel>
      )}
      <select
        className={selectClassName}
        disabled={disabled}
        aria-invalid={hasError}
        aria-required={required}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option: SelectOption) => (
          <option key={option.value} value={option.value} className={styles['option']}>
            {option.label}
          </option>
        ))}
      </select>
    </FormControl>
  );
};

export default Select;
