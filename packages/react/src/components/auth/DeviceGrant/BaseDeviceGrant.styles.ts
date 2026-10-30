// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';
import {css} from '../../../styles/emotion';

const useStyles = (theme: Theme): Record<string, string> =>
  useMemo(
    () => ({
      terminalCard: css`
        box-sizing: border-box;
        width: 100%;
        max-width: calc(${theme.vars.spacing.unit} * 60);
        margin: 0 auto;
        gap: ${theme.vars.spacing.unit};
      `,
      terminalDescription: css`
        margin: 0;
      `,
      terminalTitle: css`
        margin: 0;
      `,
    }),
    [theme],
  );

export default useStyles;
