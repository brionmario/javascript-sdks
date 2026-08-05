// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Re-export of the WebAuthn authentication handler from the Browser SDK.
 *
 * Handles WebAuthn/Passkey authentication flow for browser environments,
 * including browser compatibility checks, HTTPS validation, challenge processing,
 * and the credential authentication ceremony.
 *
 * @see {@link @thunderid/browser#handleWebAuthnAuthentication}
 */
export {handleWebAuthnAuthentication, handleWebAuthnAuthentication as default} from '@thunderid/browser';
