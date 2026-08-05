// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import {useContext} from 'react';
import ThunderIDContext, {ThunderIDContextProps} from './ThunderIDContext';

const useThunderID = (): ThunderIDContextProps => {
  const context: ThunderIDContextProps | null = useContext(ThunderIDContext);

  if (!context) {
    throw new Error('useThunderID must be used within an ThunderIDProvider');
  }

  return context;
};

export default useThunderID;
