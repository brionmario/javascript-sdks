// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  EmbeddedFlowType,
  EmbeddedSignInFlowStatus,
  executeEmbeddedDeviceGrantFlow,
  type EmbeddedDeviceGrantFlowResponse,
  type EmbeddedFlowComponent,
  type EmbeddedSignInFlowRequest,
} from '@thunderid/browser';
import {type Component, type PropType, type SetupContext, type VNode, defineComponent, h, onMounted, ref} from 'vue';
import BaseDeviceGrant from './BaseDeviceGrant';
import type {BaseDeviceGrantRenderProps, DeviceGrantResult} from './BaseDeviceGrant';
import useFlowMeta from '../../../composables/useFlowMeta';
import useI18n from '../../../composables/useI18n';
import useThunderID from '../../../composables/useThunderID';
import {extractErrorMessage, normalizeFlowResponse} from '../../../utils/flowTransformer';

export type DeviceGrantRenderProps = BaseDeviceGrantRenderProps;

interface DeviceGrantProps {
  className: string;
  onComplete?: (response: EmbeddedDeviceGrantFlowResponse) => void;
  onError?: (error: Error) => void;
  size: 'small' | 'medium' | 'large';
  variant: 'elevated' | 'outlined' | 'flat';
}

const hasUserCodeInput = (components: EmbeddedFlowComponent[]): boolean =>
  components.some(
    (component: EmbeddedFlowComponent) =>
      component.ref === 'user_code' || (Array.isArray(component.components) && hasUserCodeInput(component.components)),
  );

/** Runs the application's configured Device Grant flow and exposes its state for custom renderers. */
const DeviceGrant: Component = defineComponent({
  name: 'DeviceGrant',
  props: {
    className: {default: '', type: String},
    size: {default: 'medium', type: String as PropType<'small' | 'medium' | 'large'>},
    variant: {default: 'flat', type: String as PropType<'elevated' | 'outlined' | 'flat'>},
    onComplete: {
      default: undefined,
      type: Function as PropType<(response: EmbeddedDeviceGrantFlowResponse) => void>,
    },
    onError: {default: undefined, type: Function as PropType<(error: Error) => void>},
  },
  emits: ['complete', 'error'],
  setup(props: Readonly<DeviceGrantProps>, {emit, slots}: SetupContext): () => VNode {
    const {applicationId, baseUrl} = useThunderID();
    const {meta} = useFlowMeta();
    const {t} = useI18n();
    const components = ref<EmbeddedFlowComponent[]>([]);
    const initialValues = ref<Record<string, string>>({});
    const additionalData = ref<Record<string, unknown>>({});
    const serverFieldErrors = ref<EmbeddedDeviceGrantFlowResponse['data']['fieldErrors'] | null>(null);
    const executionId = ref('');
    const challengeToken = ref('');
    const error = ref<Error | null>(null);
    const isLoading = ref(false);
    const result = ref<DeviceGrantResult>(null);
    const flowStartAttempted = ref(false);

    const applyResponse = (response: EmbeddedDeviceGrantFlowResponse): void => {
      const normalized = normalizeFlowResponse(response, t, {resolveTranslations: false}, meta.value);
      executionId.value = response.executionId ?? '';
      challengeToken.value = response.challengeToken ?? '';
      components.value = normalized.components ?? [];
      additionalData.value = normalized.additionalData ?? {};
      serverFieldErrors.value = response.data?.fieldErrors ?? null;
      error.value = response.error ? new Error(extractErrorMessage(response, t)) : null;

      if (response.flowStatus === EmbeddedSignInFlowStatus.Complete) {
        result.value = 'success';
        props.onComplete?.(response);
        emit('complete', response);
        return;
      }
      if (response.flowStatus === EmbeddedSignInFlowStatus.Error) {
        error.value = new Error(extractErrorMessage(response, t, 'deviceGrant.messages.failed'));
        result.value = 'failure';
        props.onError?.(error.value);
        emit('error', error.value);
        return;
      }
      result.value = null;
    };

    const clearVerificationParameters = (): void => {
      const url = new URL(window.location.href);
      url.searchParams.delete('user_code');
      url.searchParams.delete('applicationId');
      window.history.replaceState(window.history.state, '', url.toString());
    };

    const startFlow = async (appId: string): Promise<void> => {
      isLoading.value = true;
      error.value = null;
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
      } catch (cause: unknown) {
        const flowError: Error = cause instanceof Error ? cause : new Error(t('deviceGrant.errors.continue'));
        components.value = [];
        additionalData.value = {};
        serverFieldErrors.value = null;
        error.value = flowError;
        result.value = 'failure';
        props.onError?.(flowError);
        emit('error', flowError);
      } finally {
        isLoading.value = false;
      }
    };

    const submit = async (payload: EmbeddedSignInFlowRequest, actionId?: string): Promise<void> => {
      isLoading.value = true;
      error.value = null;
      result.value = null;
      try {
        if (!executionId.value) return;

        // The shared flow Action renderer already compiles consent choices into consent_decisions.
        // Remove only the temporary form fields before continuing the flow.
        const inputs: Record<string, unknown> = Object.fromEntries(
          Object.entries(payload.inputs ?? {}).filter(([key]: [string, unknown]) => !key.startsWith('__consent_opt__')),
        );
        if (!hasUserCodeInput(components.value)) delete inputs['user_code'];
        const response = await executeEmbeddedDeviceGrantFlow({
          baseUrl,
          payload: {
            action: payload.action ?? actionId,
            challengeToken: challengeToken.value,
            executionId: executionId.value,
            inputs,
          },
        });
        applyResponse(response);
      } catch (cause: unknown) {
        const flowError: Error = cause instanceof Error ? cause : new Error(t('deviceGrant.errors.continue'));
        components.value = [];
        additionalData.value = {};
        serverFieldErrors.value = null;
        error.value = flowError;
        result.value = 'failure';
        props.onError?.(flowError);
        emit('error', flowError);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('user_code');
      if (code) initialValues.value = {user_code: code};

      const applicationIdFromUrl: string | null = url.searchParams.get('applicationId');
      const appId: string | undefined = applicationIdFromUrl?.trim() ? applicationIdFromUrl : applicationId;
      if (!appId) {
        const flowError: Error = new Error(t('deviceGrant.errors.start'));
        error.value = flowError;
        result.value = 'failure';
        props.onError?.(flowError);
        emit('error', flowError);
        return;
      }
      if (flowStartAttempted.value) return;

      flowStartAttempted.value = true;
      void startFlow(appId);
    });

    return (): VNode =>
      h(
        BaseDeviceGrant,
        {
          className: props.className,
          components: components.value,
          additionalData: additionalData.value,
          error: error.value,
          initialValues: initialValues.value,
          isLoading: isLoading.value,
          onSubmit: (payload: EmbeddedSignInFlowRequest, component: EmbeddedFlowComponent) =>
            submit(payload, component.id),
          result: result.value,
          serverFieldErrors: serverFieldErrors.value,
          size: props.size,
          variant: props.variant,
        },
        slots['default'] ? {default: slots['default']} : undefined,
      );
  },
});

export default DeviceGrant;
