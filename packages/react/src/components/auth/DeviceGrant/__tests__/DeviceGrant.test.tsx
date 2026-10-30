// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {EmbeddedFlowType, executeEmbeddedDeviceGrantFlow} from '@thunderid/browser';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import ThemeProvider from '../../../../contexts/Theme/ThemeProvider';
import DeviceGrant from '../DeviceGrant';

vi.mock('@thunderid/browser', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@thunderid/browser')>()),
  executeEmbeddedDeviceGrantFlow: vi.fn(),
}));

vi.mock('../../../../contexts/ThunderID/useThunderID', () => ({
  default: () => ({baseUrl: 'https://id.example.com', meta: {application: {name: 'Example App'}}}),
}));

vi.mock('../../../../hooks/useTranslation', () => ({
  default: () => ({t: (key: string) => key}),
}));

vi.mock('../../../../utils/flowTransformer', () => ({
  extractErrorMessage: () => 'deviceGrant.messages.failed',
  normalizeFlowResponse: (response: {
    data?: {additionalData?: Record<string, unknown>; meta?: {components?: unknown[]}};
  }) => ({
    additionalData: response.data?.additionalData ?? {},
    components: response.data?.meta?.components ?? [],
  }),
}));

vi.mock('../BaseDeviceGrant', () => ({
  default: (props: {
    components: unknown[];
    additionalData?: Record<string, unknown>;
    error?: Error | null;
    initialValues?: Record<string, string>;
    onSubmit: (payload: {action: string; inputs: Record<string, unknown>}, component: {id: string}) => void;
    result?: string | null;
  }) => (
    <div>
      <span data-testid="code-value">{props.initialValues?.['user_code'] ?? ''}</span>
      <span data-testid="component-count">{props.components.length}</span>
      <span data-testid="consent-prompt">{JSON.stringify(props.additionalData?.['consentPrompt'] ?? null)}</span>
      <span data-testid="flow-error">{props.error?.message ?? ''}</span>
      <span data-testid="flow-result">{props.result ?? ''}</span>
      <button
        onClick={() =>
          props.onSubmit(
            {action: 'continue', inputs: {user_code: props.initialValues?.['user_code'] ?? ''}},
            {id: 'continue'},
          )
        }
      >
        Continue
      </button>
      <button
        onClick={() =>
          props.onSubmit(
            {
              action: 'authorize',
              inputs: {
                consent_decisions: {profile: {email: true}},
                '__consent_opt__profile.email': 'true',
              },
            },
            {id: 'authorize'},
          )
        }
      >
        Submit consent
      </button>
    </div>
  ),
}));

const mockedExecute = vi.mocked(executeEmbeddedDeviceGrantFlow);

const renderDeviceGrant = (): void => {
  render(
    <ThemeProvider>
      <DeviceGrant />
    </ThemeProvider>,
  );
};

beforeEach(() => {
  window.history.replaceState({}, '', '/device?applicationId=app-1&user_code=BCDF-GHJK');
  mockedExecute.mockReset();
  mockedExecute.mockResolvedValue({
    executionId: 'execution-1',
    flowStatus: 'INCOMPLETE',
    challengeToken: 'challenge-1',
    data: {
      meta: {components: [{id: 'user-code', ref: 'user_code'}]},
      additionalData: {consentPrompt: JSON.stringify([{purposeId: 'profile', optional: [{name: 'name'}]}])},
    },
  } as never);
});

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

describe('DeviceGrant', () => {
  it('prefills the configured flow code prompt without submitting the code at flow start', async () => {
    window.history.replaceState({}, '', '/device?applicationId=app-1&user_code=BCDF-GHJK');

    renderDeviceGrant();

    await waitFor(() => {
      expect(mockedExecute).toHaveBeenCalledWith({
        baseUrl: 'https://id.example.com',
        payload: {
          applicationId: 'app-1',
          flowType: EmbeddedFlowType.DeviceGrant,
          inputs: {},
        },
      });
    });
    expect(screen.getByTestId('code-value')).toHaveTextContent('BCDF-GHJK');
    expect(window.location.search).toBe('');

    fireEvent.click(screen.getByRole('button', {name: 'Continue'}));

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(2));
    expect(mockedExecute).toHaveBeenLastCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        action: 'continue',
        challengeToken: 'challenge-1',
        executionId: 'execution-1',
        inputs: {user_code: 'BCDF-GHJK'},
      },
    });
  });

  it('lets the configured flow provide its code prompt when the URI has no code', async () => {
    window.history.replaceState({}, '', '/device?applicationId=app-1');
    renderDeviceGrant();

    await waitFor(() => {
      expect(mockedExecute).toHaveBeenCalledWith({
        baseUrl: 'https://id.example.com',
        payload: {
          applicationId: 'app-1',
          flowType: EmbeddedFlowType.DeviceGrant,
          inputs: {},
        },
      });
    });
    expect(screen.getByTestId('component-count')).toHaveTextContent('1');
  });

  it('continues the Device Grant flow after it has started', async () => {
    mockedExecute.mockResolvedValueOnce({
      executionId: 'execution-1',
      flowStatus: 'INCOMPLETE',
      challengeToken: 'challenge-1',
      data: {meta: {components: [{id: 'sign-in', ref: 'username'}]}},
    } as never);
    mockedExecute.mockResolvedValueOnce({
      executionId: 'execution-1',
      flowStatus: 'INCOMPLETE',
      challengeToken: 'challenge-2',
      data: {meta: {components: [{id: 'sign-in', ref: 'username'}]}},
    } as never);
    renderDeviceGrant();

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(window.location.search).toBe(''));
    fireEvent.click(screen.getByRole('button', {name: 'Continue'}));

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(2));
    expect(mockedExecute).toHaveBeenLastCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        action: 'continue',
        challengeToken: 'challenge-1',
        executionId: 'execution-1',
        inputs: {user_code: undefined},
      },
    });
  });

  it('strips internal consent option fields but preserves consent_decisions', async () => {
    window.history.replaceState({}, '', '/device?applicationId=app-1');
    mockedExecute.mockResolvedValueOnce({
      executionId: 'execution-1',
      flowStatus: 'INCOMPLETE',
      challengeToken: 'challenge-1',
      data: {meta: {components: [{id: 'consent', type: 'CONSENT'}]}},
    } as never);
    renderDeviceGrant();

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', {name: 'Submit consent'}));

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(2));
    expect(mockedExecute).toHaveBeenLastCalledWith({
      baseUrl: 'https://id.example.com',
      payload: {
        action: 'authorize',
        challengeToken: 'challenge-1',
        executionId: 'execution-1',
        inputs: {consent_decisions: {profile: {email: true}}, user_code: undefined},
      },
    });
  });

  it('shows continuation failures from the OAuth callback', async () => {
    mockedExecute
      .mockResolvedValueOnce({
        executionId: 'execution-1',
        flowStatus: 'INCOMPLETE',
        challengeToken: 'challenge-1',
        data: {meta: {components: [{id: 'user-code', ref: 'user_code'}]}},
      } as never)
      .mockRejectedValueOnce(new Error('callback rejected approval'));
    renderDeviceGrant();

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(window.location.search).toBe(''));
    fireEvent.click(screen.getByRole('button', {name: 'Continue'}));

    await waitFor(() => expect(screen.getByTestId('flow-error')).toHaveTextContent('callback rejected approval'));
    expect(screen.getByTestId('flow-result')).toHaveTextContent('failure');
  });

  it('maps only a COMPLETE flow response to success and calls onComplete', async () => {
    const onComplete = vi.fn();
    mockedExecute.mockResolvedValueOnce({
      executionId: 'execution-1',
      flowStatus: 'COMPLETE',
      data: {meta: {components: []}},
    } as never);

    render(
      <ThemeProvider>
        <DeviceGrant onComplete={onComplete} />
      </ThemeProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('flow-result')).toHaveTextContent('success'));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('keeps an empty INCOMPLETE response non-terminal', async () => {
    mockedExecute.mockResolvedValueOnce({
      executionId: 'execution-1',
      flowStatus: 'INCOMPLETE',
      data: {meta: {components: []}},
    } as never);

    renderDeviceGrant();

    await waitFor(() => expect(mockedExecute).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('flow-result')).toBeEmptyDOMElement();
  });

  it('reports a start error when no application ID is available', async () => {
    window.history.replaceState({}, '', '/device');

    renderDeviceGrant();

    await waitFor(() => expect(screen.getByTestId('flow-error')).toHaveTextContent('deviceGrant.errors.start'));
    expect(mockedExecute).not.toHaveBeenCalled();
  });
});
