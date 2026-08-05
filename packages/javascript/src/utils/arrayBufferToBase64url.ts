// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Converts an ArrayBuffer to a base64url encoded string.
 *
 * Base64url encoding is a URL-safe variant of base64 encoding that:
 * - Replaces '+' with '-'
 * - Replaces '/' with '_'
 * - Removes padding '=' characters
 *
 * This encoding is commonly used in JWT tokens, OAuth2 PKCE challenges,
 * and other web standards where the encoded data needs to be safely
 * transmitted in URLs or HTTP headers.
 *
 * @param buffer - The ArrayBuffer to convert to base64url string
 * @returns The base64url encoded string representation of the input buffer
 *
 * @example
 * ```typescript
 * const buffer = new TextEncoder().encode('Hello World');
 * const encoded = arrayBufferToBase64url(buffer);
 * console.log(encoded); // "SGVsbG8gV29ybGQ"
 * ```
 *
 * @example
 * ```typescript
 * // Converting crypto random bytes for PKCE challenge
 * const randomBytes = crypto.getRandomValues(new Uint8Array(32));
 * const codeVerifier = arrayBufferToBase64url(randomBytes.buffer);
 * ```
 */
const arrayBufferToBase64url = (buffer: ArrayBuffer): string => {
  const bytes: Uint8Array<ArrayBuffer> = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export default arrayBufferToBase64url;
