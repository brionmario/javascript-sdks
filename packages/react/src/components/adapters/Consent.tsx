/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {type ConsentPurposeData, PromptElement} from '@thunderid/browser';
import {type ChangeEvent, FC, ReactNode} from 'react';
import ConsentCheckboxList, {getConsentOptionalKey} from './ConsentCheckboxList';
import Typography from '../primitives/Typography/Typography';
import Toggle from '../primitives/Toggle/Toggle';
import {Info} from '../primitives/Icons';
import Tooltip from '../primitives/Tooltip/Tooltip';

/**
 * Backward-compatible consent purpose type exported by @thunderid/react.
 *
 * Some consumers import this name directly; keep it as an alias to the v2 model.
 */
export type ConsentPurpose = ConsentPurposeData;

/**
 * Render props exposed by Consent when using the render-prop pattern.
 */
export interface ConsentRenderProps {
  /** Current form values - used to read optional checkbox state. */
  formValues: Record<string, string>;
  /** Callback invoked when a user toggles an optional attribute. */
  onInputChange: (name: string, value: string) => void;
  /** The resolved list of consent purposes parsed from `consentData`. */
  purposes: ConsentPurposeData[];
}

/**
 * Interface for consent configuration
 */
export interface ConsentConfig {
  essential?: string;
  optional?: string;
  essentialInfo?: string;
  optionalInfo?: string;
}

/**
 * Props for the Consent component.
 */
export interface ConsentProps {
  /**
   * Render-props callback. When provided, the default consent UI is replaced with
   * whatever JSX the callback returns. The parsed `purposes` list is injected so
   * consumers do not need to re-parse `consentData` themselves.
   *
   * @example
   * ```tsx
   * <Consent consentData={raw} formValues={formInputs} onInputChange={onChange} t={t}>
   *   {({ purposes, formValues, onInputChange, t }) => (
   *     <div>
   *       {purposes.map(p => <MyConsentSection key={p.purposeId} purpose={p} />)}
   *     </div>
   *   )}
   * </Consent>
   * ```
   */
  children?: (props: ConsentRenderProps) => ReactNode;
  /**
   * The raw JSON string returned by the backend in `additionalData.consentPrompt`.
   */
  consentData?: string | ConsentPurposeData[] | {purposes: ConsentPurposeData[]};
  /**
   * Current form values - used to read optional checkbox state.
   */
  formValues: Record<string, string>;
  /**
   * Callback invoked when a user toggles an optional attribute.
   */
  onInputChange: (name: string, value: string) => void;
  /**
   * Config to modified detail in consent page
   */
  config?: Record<string, unknown>;
}

const defaultConfig: Required<Pick<ConsentConfig, 'essential' | 'optional'>> = {
  essential: 'Essential Attributtes',
  optional: 'Optional Attributes',
};

/**
 * Consent component renders the list of purposes and their associated attributes (essential and optional)
 * based on the data provided by the backend. It allows users to toggle optional attributes while essential
 * attributes are displayed as read-only.
 */
const Consent: FC<ConsentProps> = ({
  consentData,
  formValues,
  config: suppliedConfig = {},
  onInputChange,
  children,
}: ConsentProps) => {
  const config: ConsentConfig = {...defaultConfig, ...suppliedConfig};
  const essentialInfo = typeof config.essentialInfo === 'string' ? config.essentialInfo.trim() : '';
  const optionalInfo = typeof config.optionalInfo === 'string' ? config.optionalInfo.trim() : '';
  /**
   * Method to check whether master toggle button is checked or not
   * @param purpose Purpose object
   * @param checked boolean variable to check, whether toggle is checked or unchecked
   */
  const handleChange = (purpose: ConsentPurposeData, checked: boolean): void => {
    const checkValue = checked ? 'true' : 'false';
    purpose.optional.map((opt: PromptElement) => {
      const key: string = getConsentOptionalKey(purpose.purposeId, opt.name);
      onInputChange(key, checkValue);
    });
  };

  /**
   * Check all optional claims are selected or not
   * @param purpose Purpose object
   * @returns boolean value to denote all optional claims are selected
   */
  const checkOptValue = (purpose: ConsentPurposeData): boolean => {
    return purpose.optional.every((opt: PromptElement) => {
      const key: string = getConsentOptionalKey(purpose.purposeId, opt.name);
      return formValues[key] === 'true';
    });
  };

  if (!consentData) return null;

  let purposes: ConsentPurposeData[] = [];

  try {
    const parsed: ConsentPurposeData[] | {purposes: ConsentPurposeData[]} =
      typeof consentData === 'string' ? JSON.parse(consentData) : consentData;

    purposes = Array.isArray(parsed) ? parsed : parsed.purposes || [];
  } catch (e) {
    // Failed to parse consent prompt data
    return null;
  }

  if (purposes.length === 0) return null;

  if (children) {
    return <>{children({formValues, onInputChange, purposes: purposes})}</>;
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.25rem'}}>
      {purposes.map((purpose: ConsentPurposeData, purposeIndex: number) => (
        <div key={purpose.purposeId || purposeIndex} style={{paddingBottom: '1rem'}}>
          {/* TODO: Uncomment when the backend supports multiple purposes for a application */}
          {/* <Typography variant="h6" fontWeight={600} gutterBottom color="inherit">
            {purpose.purposeName}
          </Typography>
          <Typography variant="body2" color="inherit" style={{marginBottom: '1rem', opacity: 0.85}}>
            {purpose.description}
          </Typography> */}

          {purpose.essential && purpose.essential.length > 0 && (
            <div style={{marginTop: '0.5rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px'}}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {config['essential'] as string}
                </Typography>
                {essentialInfo !== '' && (
                  <Tooltip helperText={essentialInfo}>
                    <Info width="1rem" height="1rem" />
                  </Tooltip>
                )}
              </div>
              <ConsentCheckboxList
                variant="ESSENTIAL"
                purpose={purpose}
                formValues={formValues}
                onInputChange={onInputChange}
              />
            </div>
          )}

          {purpose.optional && purpose.optional.length > 0 && (
            <div style={{marginTop: '0.5rem'}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: '4px',
                  marginBottom: '10px',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {purpose.type === 'permissions' ? 'Permissions' : (config['optional'] as string)}
                  </Typography>
                  {optionalInfo !== '' && (
                    <Tooltip helperText={optionalInfo}>
                      <Info width="1rem" height="1rem" />
                    </Tooltip>
                  )}
                </div>
                <Toggle
                  id={`consent_opt_${purpose.purposeId}_all`}
                  checked={checkOptValue(purpose)}
                  aria-label="Toggle all optional attributes"
                  onChange={(e: ChangeEvent<HTMLInputElement>): void => handleChange(purpose, e.target.checked)}
                />
              </div>
              <ConsentCheckboxList
                variant="OPTIONAL"
                purpose={purpose}
                formValues={formValues}
                onInputChange={onInputChange}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Consent;
