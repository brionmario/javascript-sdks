// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import I18nProvider from '../../../../contexts/I18n/I18nProvider';
import ThemeProvider from '../../../../contexts/Theme/ThemeProvider';
import BaseDeviceGrant from '../BaseDeviceGrant';

const renderResult = (error: Error | null = null): void => {
  render(
    <I18nProvider>
      <ThemeProvider>
        <BaseDeviceGrant
          completeDescription="You can return to your device."
          completeMessage="Device authorized"
          components={[]}
          error={error}
          failedDescription="Return to your device and start again."
          failedMessage="Device authorization failed"
          isLoading={false}
          onSubmit={() => Promise.resolve()}
          result={error ? 'failure' : 'success'}
        />
      </ThemeProvider>
    </I18nProvider>,
  );
};

afterEach(() => cleanup());

describe('BaseDeviceGrant terminal result', () => {
  it('renders a compact success card', () => {
    renderResult();

    expect(screen.getByTestId('device-grant-result')).toHaveTextContent(
      'Device authorizedYou can return to your device.',
    );
  });

  it('uses bundled result text without requiring copy props', () => {
    render(
      <I18nProvider>
        <ThemeProvider>
          <BaseDeviceGrant components={[]} isLoading={false} onSubmit={() => Promise.resolve()} result="success" />
        </ThemeProvider>
      </I18nProvider>,
    );

    expect(screen.getByTestId('device-grant-result')).toHaveTextContent(
      'Device authorizedYou can return to your device.',
    );
  });

  it('renders a compact failure card', () => {
    renderResult(new Error('Device authorization failed'));

    expect(screen.getByTestId('device-grant-result')).toHaveTextContent(
      'Device authorization failedReturn to your device and start again.',
    );
  });

  it('preserves unexpected errors as the failure description', () => {
    renderResult(new Error('The callback endpoint rejected the response.'));

    expect(screen.getByTestId('device-grant-result')).toHaveTextContent(
      'Device authorization failedThe callback endpoint rejected the response.',
    );
  });

  it('does not infer success from an incomplete response with no components', () => {
    render(
      <I18nProvider>
        <ThemeProvider>
          <BaseDeviceGrant components={[]} isLoading={false} onSubmit={() => Promise.resolve()} result={null} />
        </ThemeProvider>
      </I18nProvider>,
    );

    expect(screen.queryByTestId('device-grant-result')).not.toBeInTheDocument();
  });
});
