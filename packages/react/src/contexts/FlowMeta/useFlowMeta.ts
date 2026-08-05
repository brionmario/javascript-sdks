// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import FlowMetaContext, {FlowMetaContextValue} from './FlowMetaContext';

const useFlowMeta = (): FlowMetaContextValue => {
  const context: FlowMetaContextValue | null = useContext(FlowMetaContext);
  if (!context) {
    throw new Error('useFlowMeta must be used within a FlowMetaProvider');
  }
  return context;
};

export default useFlowMeta;
