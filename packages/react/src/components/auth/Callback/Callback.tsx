// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC, useState} from 'react';
import {OAuthCallback, OAuthCallbackProps} from './OAuthCallback';
import {TokenCallback, TokenCallbackProps} from './TokenCallback';

/**
 * Props for the unified Callback component, combining properties for both Token and OAuth callbacks.
 */
export type CallbackProps = OAuthCallbackProps & TokenCallbackProps;

/**
 * A unified Callback component that automatically routes to either OAuthCallback or TokenCallback
 * based on the presence of URL parameters ('code' for OAuth, 'token' for token-based flows).
 */
export const Callback: FC<CallbackProps> = (props: CallbackProps) => {
  // Use state to lock the flow type on initial mount.
  // This prevents the component from swapping to OAuthCallback if TokenCallback
  // removes the '?token=' query parameter from the URL using window.history.
  const [flowType] = useState<'token' | 'oauth'>(() => {
    if (typeof window === 'undefined') {
      return 'oauth';
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') ? 'token' : 'oauth';
  });

  if (typeof window === 'undefined') {
    return null;
  }

  if (flowType === 'token') {
    return <TokenCallback {...props} />;
  }

  return <OAuthCallback {...props} />;
};

export default Callback;
