// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {executeEmbeddedDeviceGrantFlow, EmbeddedFlowType} from '@thunderid/browser';
import {flushPromises, mount} from '@vue/test-utils';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {nextTick, ref} from 'vue';
import BaseDeviceGrant from '../../../components/auth/device-grant/BaseDeviceGrant';
import DeviceGrant from '../../../components/auth/device-grant/DeviceGrant';
import {FLOW_KEY, FLOW_META_KEY, I18N_KEY, THUNDERID_KEY} from '../../../keys';

vi.mock('@thunderid/browser', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@thunderid/browser')>()),
  executeEmbeddedDeviceGrantFlow: vi.fn(),
}));

afterEach(() => {
  vi.mocked(executeEmbeddedDeviceGrantFlow).mockReset();
  window.history.replaceState({}, '', '/');
});

describe('BaseDeviceGrant', () => {
  it('renders server-provided consent data on a Device Grant step', () => {
    const wrapper = mount(BaseDeviceGrant, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: {
            addMessage: () => undefined,
            clearMessages: () => undefined,
            messages: ref([]),
            subtitle: ref(null),
            title: ref(null),
          },
          [FLOW_META_KEY as symbol]: {meta: ref(null)},
          [I18N_KEY as symbol]: {currentLanguage: ref('en-US'), t: (key: string): string => key},
        },
      },
      props: {
        additionalData: {
          consentPrompt: {
            purposes: [
              {
                essential: [],
                optional: [{name: 'booking:read'}],
                purposeId: 'permissions',
                type: 'permissions',
              },
            ],
          },
        },
        components: [{id: 'consent', type: 'CONSENT'}],
        onSubmit: () => Promise.resolve(),
      },
    });

    expect(wrapper.text()).toContain('Optional Permissions');
    expect(wrapper.text()).toContain('booking:read');
    expect(wrapper.findAll('[role="switch"]')).toHaveLength(2);
    expect(wrapper.get('.thunderid-card').classes()).toContain('thunderid-card--flat');
  });

  it('prefills the user code from the verification URI values', async () => {
    const wrapper = mount(BaseDeviceGrant, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: {
            addMessage: () => undefined,
            clearMessages: () => undefined,
            messages: ref([]),
            subtitle: ref(null),
            title: ref(null),
          },
          [FLOW_META_KEY as symbol]: {meta: ref(null)},
          [I18N_KEY as symbol]: {currentLanguage: ref('en-US'), t: (key: string): string => key},
        },
      },
      props: {
        components: [
          {
            id: 'user-code',
            label: 'Verification code',
            placeholder: 'ABCD-EFGH',
            ref: 'user_code',
            required: true,
            type: 'TEXT_INPUT',
          },
        ],
        initialValues: {user_code: 'ABCD-EFGH'},
        onSubmit: () => Promise.resolve(),
      },
    });

    await nextTick();
    expect((wrapper.find('input[name="user_code"]').element as HTMLInputElement).value).toBe('ABCD-EFGH');
  });
});

describe('DeviceGrant', () => {
  it('prefills the configured flow code prompt without submitting the code at flow start', async () => {
    window.history.replaceState({}, '', '/gate/device?applicationId=app-1&user_code=BCDF-GHJK');
    vi.mocked(executeEmbeddedDeviceGrantFlow).mockResolvedValue({
      challengeToken: 'challenge-1',
      data: {
        meta: {
          components: [
            {id: 'user-code', label: 'Verification code', ref: 'user_code', required: true, type: 'TEXT_INPUT'},
            {eventType: 'SUBMIT', id: 'continue', label: 'Continue', type: 'ACTION'},
          ],
        },
      },
      executionId: 'execution-1',
      flowStatus: 'INCOMPLETE',
    } as never);

    const wrapper = mount(DeviceGrant, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: {
            addMessage: vi.fn(),
            clearMessages: vi.fn(),
            messages: ref([]),
            subtitle: ref(null),
            title: ref(null),
          },
          [FLOW_META_KEY as symbol]: {meta: ref(null)},
          [I18N_KEY as symbol]: {currentLanguage: ref('en-US'), t: (key: string): string => key},
          [THUNDERID_KEY as symbol]: {applicationId: undefined, baseUrl: 'https://id.example.com'},
        },
      },
    });

    await flushPromises();

    expect(executeEmbeddedDeviceGrantFlow).toHaveBeenCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        applicationId: 'app-1',
        flowType: EmbeddedFlowType.DeviceGrant,
        inputs: {},
      },
    });
    expect((wrapper.find('input[name="user_code"]').element as HTMLInputElement).value).toBe('BCDF-GHJK');
    expect(window.location.search).toBe('');
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(executeEmbeddedDeviceGrantFlow).toHaveBeenLastCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        action: 'continue',
        challengeToken: 'challenge-1',
        executionId: 'execution-1',
        inputs: {user_code: 'BCDF-GHJK'},
      },
    });
    wrapper.unmount();
  });

  it('renders the configured code prompt when the verification URI has no code', async () => {
    window.history.replaceState({}, '', '/gate/device?applicationId=app-1');
    vi.mocked(executeEmbeddedDeviceGrantFlow).mockResolvedValue({
      challengeToken: 'challenge-1',
      data: {
        meta: {
          components: [
            {
              id: 'user-code',
              label: 'Verification code',
              ref: 'user_code',
              required: true,
              type: 'TEXT_INPUT',
            },
          ],
        },
      },
      executionId: 'execution-1',
      flowStatus: 'INCOMPLETE',
    } as never);

    const wrapper = mount(DeviceGrant, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: {
            addMessage: vi.fn(),
            clearMessages: vi.fn(),
            messages: ref([]),
            subtitle: ref(null),
            title: ref(null),
          },
          [FLOW_META_KEY as symbol]: {meta: ref(null)},
          [I18N_KEY as symbol]: {currentLanguage: ref('en-US'), t: (key: string): string => key},
          [THUNDERID_KEY as symbol]: {applicationId: undefined, baseUrl: 'https://id.example.com'},
        },
      },
    });

    await flushPromises();

    expect(executeEmbeddedDeviceGrantFlow).toHaveBeenCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        applicationId: 'app-1',
        flowType: EmbeddedFlowType.DeviceGrant,
        inputs: {},
      },
    });
    expect(wrapper.find('input[name="user_code"]').exists()).toBe(true);
    wrapper.unmount();
  });

  it('does not start when the verification URL has no application ID', async () => {
    window.history.replaceState({}, '', '/gate/device?user_code=BCDF-GHJK');
    const wrapper = mount(DeviceGrant, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: {
            addMessage: vi.fn(),
            clearMessages: vi.fn(),
            messages: ref([]),
            subtitle: ref(null),
            title: ref(null),
          },
          [FLOW_META_KEY as symbol]: {meta: ref(null)},
          [I18N_KEY as symbol]: {currentLanguage: ref('en-US'), t: (key: string): string => key},
          [THUNDERID_KEY as symbol]: {applicationId: undefined, baseUrl: 'https://id.example.com'},
        },
      },
    });

    await flushPromises();

    expect(executeEmbeddedDeviceGrantFlow).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('deviceGrant.errors.start');
    wrapper.unmount();
  });

  it('does not retain the user code when a later step no longer contains that input', async () => {
    window.history.replaceState({}, '', '/gate/device?applicationId=app-1&user_code=BCDF-GHJK');
    vi.mocked(executeEmbeddedDeviceGrantFlow)
      .mockResolvedValueOnce({
        challengeToken: 'challenge-1',
        data: {
          meta: {
            components: [{eventType: 'SUBMIT', id: 'continue', label: 'Continue', type: 'ACTION'}],
          },
        },
        executionId: 'execution-1',
        flowStatus: 'INCOMPLETE',
      } as never)
      .mockResolvedValueOnce({
        challengeToken: 'challenge-2',
        data: {meta: {components: []}},
        executionId: 'execution-1',
        flowStatus: 'INCOMPLETE',
      } as never);

    const wrapper = mount(DeviceGrant, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: {
            addMessage: vi.fn(),
            clearMessages: vi.fn(),
            messages: ref([]),
            subtitle: ref(null),
            title: ref(null),
          },
          [FLOW_META_KEY as symbol]: {meta: ref(null)},
          [I18N_KEY as symbol]: {currentLanguage: ref('en-US'), t: (key: string): string => key},
          [THUNDERID_KEY as symbol]: {applicationId: undefined, baseUrl: 'https://id.example.com'},
        },
      },
    });

    await flushPromises();
    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(executeEmbeddedDeviceGrantFlow).toHaveBeenNthCalledWith(1, {
      baseUrl: 'https://id.example.com',
      payload: {
        applicationId: 'app-1',
        flowType: EmbeddedFlowType.DeviceGrant,
        inputs: {},
      },
    });
    expect(executeEmbeddedDeviceGrantFlow).toHaveBeenLastCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        action: 'continue',
        challengeToken: 'challenge-1',
        executionId: 'execution-1',
        inputs: {},
      },
    });
    wrapper.unmount();
  });
});
