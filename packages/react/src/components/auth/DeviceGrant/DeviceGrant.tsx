// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {EmbeddedFlowType, EmbeddedSignInFlowStatus, executeEmbeddedDeviceGrantFlow} from '@thunderid/browser';
import type {EmbeddedFlowComponent, EmbeddedSignInFlowRequest, FlowMetadataResponse} from '@thunderid/browser';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {FC, ReactElement, ReactNode} from 'react';
import BaseDeviceGrant, {type BaseDeviceGrantProps, type DeviceGrantResult} from './BaseDeviceGrant';
import useThunderID from '../../../contexts/ThunderID/useThunderID';
import useTranslation from '../../../hooks/useTranslation';
import {extractErrorMessage, normalizeFlowResponse} from '../../../utils/flowTransformer';

type EmbeddedDeviceGrantFlowResponse = Awaited<ReturnType<typeof executeEmbeddedDeviceGrantFlow>>;
type DeviceGrantFieldError = NonNullable<EmbeddedDeviceGrantFlowResponse['data']['fieldErrors']>[number];

/** Values exposed to consumers that provide custom Device Grant UI. */
export interface DeviceGrantRenderProps {
  /** Additional values returned for the active flow step. */
  additionalData: Record<string, unknown>;
  /** Components returned by the configured flow. */
  components: EmbeddedFlowComponent[];
  /** Current flow error, when one needs to be shown. */
  error: Error | null;
  /** First server validation message for each field. */
  fieldErrors: Record<string, string>;
  /** Values prefilled from the verification URI. */
  initialValues: Record<string, string>;
  /** Whether a flow request is in progress. */
  isLoading: boolean;
  /** Flow metadata used to resolve application-specific template values. */
  meta: FlowMetadataResponse | null;
  /** Submits user-code input or continues the active flow. */
  onSubmit: (payload: EmbeddedSignInFlowRequest) => Promise<void>;
  /** Terminal flow result when the flow has no configured prompt to render. */
  result: DeviceGrantResult;
}

export type DeviceGrantProps = Omit<
  BaseDeviceGrantProps,
  'children' | 'components' | 'error' | 'initialValues' | 'isLoading' | 'onSubmit' | 'result' | 'serverFieldErrors'
> & {
  /** Render props for Gate or other consumers that provide their own flow UI. */
  children?: (props: DeviceGrantRenderProps) => ReactNode;
  onComplete?: (response: EmbeddedDeviceGrantFlowResponse) => void;
};

const clearVerificationParameters = (): void => {
  if (!window.location.href) return;
  const url = new URL(window.location.href);
  url.searchParams.delete('user_code');
  url.searchParams.delete('applicationId');
  window.history.replaceState(window.history.state, '', url.toString());
};

const hasUserCodeInput = (components: EmbeddedFlowComponent[]): boolean =>
  components.some(
    (component: EmbeddedFlowComponent) =>
      component.ref === 'user_code' || (Array.isArray(component.components) && hasUserCodeInput(component.components)),
  );

/**
 * Runs the application's configured Device Grant flow and exposes its state for custom renderers.
 */
const DeviceGrant: FC<DeviceGrantProps> = ({
  children = undefined,
  className = '',
  onComplete = undefined,
  onError = undefined,
  preferences = {},
  size = 'medium',
  variant = 'default',
  ...baseProps
}: DeviceGrantProps): ReactElement => {
  const {applicationId, baseUrl, meta} = useThunderID();
  const {t} = useTranslation(preferences?.i18n);
  const [components, setComponents] = useState<EmbeddedFlowComponent[]>([]);
  const [additionalData, setAdditionalData] = useState<Record<string, unknown>>({});
  const [initialValues, setInitialValues] = useState<Record<string, string>>({});
  const [serverFieldErrors, setServerFieldErrors] = useState<
    EmbeddedDeviceGrantFlowResponse['data']['fieldErrors'] | null
  >(null);
  const [executionId, setExecutionId] = useState('');
  const [challengeToken, setChallengeToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(() => {
    if (applicationId) return true;
    return typeof window !== 'undefined' && Boolean(new URL(window.location.href).searchParams.get('applicationId'));
  });
  const [result, setResult] = useState<DeviceGrantResult>(null);
  const flowStartAttempted = useRef(false);
  const verificationParametersRead = useRef(false);

  const handleError = useCallback(
    (flowError: Error): void => {
      setComponents([]);
      setAdditionalData({});
      setServerFieldErrors(null);
      setError(flowError);
      setResult('failure');
      onError?.(flowError);
    },
    [onError],
  );

  const applyResponse = useCallback(
    (response: EmbeddedDeviceGrantFlowResponse): void => {
      const normalized = normalizeFlowResponse(
        response,
        t,
        {
          throwOnError: false,
          resolveTranslations: false,
        },
        meta,
      );
      setExecutionId(response.executionId);
      setChallengeToken(response.challengeToken ?? '');
      setComponents(normalized.components);
      setAdditionalData(normalized.additionalData);
      setServerFieldErrors(response.data?.fieldErrors ?? null);
      setError(response.error ? new Error(extractErrorMessage(response, t)) : null);

      if (response.flowStatus === EmbeddedSignInFlowStatus.Complete) {
        setResult('success');
        onComplete?.(response);
        return;
      }

      if (response.flowStatus === EmbeddedSignInFlowStatus.Error) {
        const flowError = new Error(extractErrorMessage(response, t, 'deviceGrant.messages.failed'));
        setError(flowError);
        setResult('failure');
        onError?.(flowError);
        return;
      }

      setResult(null);
    },
    [meta, onComplete, onError, t],
  );

  const startFlow = useCallback(
    async (appId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await executeEmbeddedDeviceGrantFlow({
          baseUrl,
          payload: {
            applicationId: appId,
            flowType: EmbeddedFlowType.DeviceGrant,
            inputs: {},
          },
        });
        clearVerificationParameters();
        applyResponse(response);
      } catch (flowError) {
        handleError(flowError instanceof Error ? flowError : new Error(t('deviceGrant.errors.continue')));
      } finally {
        setIsLoading(false);
      }
    },
    [applyResponse, baseUrl, handleError, t],
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!verificationParametersRead.current) {
      verificationParametersRead.current = true;
      const userCode = url.searchParams.get('user_code') ?? '';
      if (userCode) setInitialValues({user_code: userCode});
    }

    const applicationIdFromUrl = url.searchParams.get('applicationId');
    const appId = applicationIdFromUrl?.trim() ? applicationIdFromUrl : applicationId;
    if (flowStartAttempted.current) return;
    if (!appId) {
      flowStartAttempted.current = true;
      handleError(new Error(t('deviceGrant.errors.start')));
      return;
    }

    flowStartAttempted.current = true;
    void startFlow(appId);
  }, [applicationId, handleError, startFlow, t]);

  const submit = async (payload: EmbeddedSignInFlowRequest, actionId?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      if (!executionId) return;

      const response = await executeEmbeddedDeviceGrantFlow({
        baseUrl,
        payload: {
          action: payload.action ?? actionId,
          challengeToken,
          executionId,
          inputs: {
            ...Object.fromEntries(
              Object.entries(payload.inputs ?? {}).filter(
                ([key]: [string, unknown]) => !key.startsWith('__consent_opt__'),
              ),
            ),
            ...(!hasUserCodeInput(components) ? {user_code: undefined} : {}),
          },
        },
      });
      applyResponse(response);
    } catch (flowError) {
      handleError(flowError instanceof Error ? flowError : new Error(t('deviceGrant.errors.continue')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBaseSubmit = (payload: EmbeddedSignInFlowRequest, component: EmbeddedFlowComponent): Promise<void> =>
    submit(payload, component.id);

  const fieldErrors = useMemo<Record<string, string>>(() => {
    const errors: Record<string, string> = {};
    (serverFieldErrors ?? []).forEach((fieldError: DeviceGrantFieldError) => {
      if (!(fieldError.identifier in errors)) errors[fieldError.identifier] = fieldError.message;
    });

    return errors;
  }, [serverFieldErrors]);

  if (children) {
    return (
      <>
        {children({
          additionalData,
          components,
          error,
          fieldErrors,
          initialValues,
          isLoading,
          meta,
          onSubmit: submit,
          result,
        })}
      </>
    );
  }

  return (
    <BaseDeviceGrant
      {...baseProps}
      className={className}
      components={components}
      additionalData={additionalData}
      error={error}
      initialValues={initialValues}
      isLoading={isLoading}
      onError={handleError}
      onSubmit={handleBaseSubmit}
      preferences={preferences}
      result={result}
      serverFieldErrors={serverFieldErrors}
      size={size}
      variant={variant}
    />
  );
};

export default DeviceGrant;
