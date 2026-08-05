// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react';
import FlowContext, {FlowContextValue} from './FlowContext';

/**
 * Hook to access the flow context.
 * Must be used within a FlowProvider.
 *
 * @example
 * ```tsx
 * const MyAuthComponent = () => {
 *   const { title, setTitle, addMessage, isLoading } = useFlow();
 *
 *   const handleSuccess = () => {
 *     addMessage({
 *       type: 'success',
 *       message: 'Authentication successful!'
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <h1>{title}</h1>
 *       {isLoading && <p>Loading...</p>}
 *     </div>
 *   );
 * };
 * ```
 *
 * @returns The flow context value
 * @throws Error if used outside of FlowProvider
 */
const useFlow = (): FlowContextValue => {
  const context: FlowContextValue | undefined = useContext(FlowContext);

  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }

  return context;
};

export default useFlow;
