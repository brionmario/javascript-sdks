// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {EmbeddedFlowComponent, WithPreferences} from '@thunderid/browser';

/**
 * Props shared by all adapter components.
 */
export interface AdapterProps extends WithPreferences {
  /**
   * Custom CSS class name for buttons.
   */
  buttonClassName?: string;

  /**
   * The component configuration from the flow response.
   */
  component: EmbeddedFlowComponent;

  /**
   * Form validation errors.
   */
  formErrors: Record<string, string>;

  /**
   * Current form values.
   */
  formValues: Record<string, string>;

  /**
   * Custom CSS class name for form inputs.
   */
  inputClassName?: string;

  /**
   * Whether the form is valid.
   */
  isFormValid: boolean;

  /**
   * Whether the component is in loading state.
   */
  isLoading: boolean;

  /**
   * Callback function called when input values change.
   */
  onInputChange: (name: string, value: string) => void;

  onSubmit?: (component: EmbeddedFlowComponent, data?: Record<string, any>) => void;

  /**
   * Component size variant.
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Touched state for form fields.
   */
  touchedFields: Record<string, boolean>;

  /**
   * Component theme variant.
   */
  variant?: any;
}
