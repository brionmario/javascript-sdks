// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import I18nProvider from '../../../../contexts/I18n/I18nProvider';
import ThemeProvider from '../../../../contexts/Theme/ThemeProvider';
import ThunderIDContext, {ThunderIDContextProps} from '../../../../contexts/ThunderID/ThunderIDContext';
import BaseSignIn from '../BaseSignIn';

const thunderIDContext: ThunderIDContextProps = {
  isInitialized: true,
  isLoading: false,
  vendor: 'thunderid',
} as unknown as ThunderIDContextProps;

describe('BaseSignIn', () => {
  afterEach(() => {
    cleanup();
  });

  it('exposes the step additionalData to render props', () => {
    const renderChild = vi.fn(() => <div />);

    render(
      <ThunderIDContext.Provider value={thunderIDContext}>
        <I18nProvider>
          <ThemeProvider>
            <BaseSignIn additionalData={{linkingPromptDetails: '[]'}} components={[]} onSubmit={vi.fn()}>
              {renderChild}
            </BaseSignIn>
          </ThemeProvider>
        </I18nProvider>
      </ThunderIDContext.Provider>,
    );

    expect(renderChild).toHaveBeenLastCalledWith(
      expect.objectContaining({additionalData: {linkingPromptDetails: '[]'}}),
    );
  });

  it('applies supplied initial values to the form render props', async () => {
    let renderedValues: Record<string, string> = {};

    render(
      <ThunderIDContext.Provider value={thunderIDContext}>
        <I18nProvider>
          <ThemeProvider>
            <BaseSignIn components={[]} initialValues={{user_code: 'ABCD-EFGH'}} onSubmit={vi.fn()}>
              {({values}) => {
                renderedValues = values;
                return <div />;
              }}
            </BaseSignIn>
          </ThemeProvider>
        </I18nProvider>
      </ThunderIDContext.Provider>,
    );

    await waitFor(() => expect(renderedValues).toEqual({user_code: 'ABCD-EFGH'}));
  });

  it('does not reapply equivalent initial values after the user edits a field', async () => {
    const renderBaseSignIn = (initialValues: Record<string, string>) => (
      <ThunderIDContext.Provider value={thunderIDContext}>
        <I18nProvider>
          <ThemeProvider>
            <BaseSignIn components={[]} initialValues={initialValues} onSubmit={vi.fn()}>
              {({handleInputChange, values}) => (
                <input
                  aria-label="Verification code"
                  value={values.user_code ?? ''}
                  onChange={(event) => handleInputChange('user_code', event.target.value)}
                />
              )}
            </BaseSignIn>
          </ThemeProvider>
        </I18nProvider>
      </ThunderIDContext.Provider>
    );
    const {rerender} = render(renderBaseSignIn({user_code: 'ABCD-EFGH'}));

    await waitFor(() => expect(screen.getByRole('textbox', {name: 'Verification code'})).toHaveValue('ABCD-EFGH'));
    fireEvent.change(screen.getByRole('textbox', {name: 'Verification code'}), {target: {value: 'WXYZ-1234'}});
    rerender(renderBaseSignIn({user_code: 'ABCD-EFGH'}));

    expect(screen.getByRole('textbox', {name: 'Verification code'})).toHaveValue('WXYZ-1234');
  });
});
