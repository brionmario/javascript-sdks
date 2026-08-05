// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * JWK Model
 */
export interface JWKInterface {
  alg: string;
  e?: string;
  kid: string;
  kty: string;
  n?: string;
  /** Raw public key bytes (base64url), for AKP JWKs (RFC 9864, e.g. ML-DSA). */
  pub?: string;
  use: string;
}

/**
 * Cryptographic utility interface for OIDC operations.
 * Provides methods for encoding, decoding, hashing, and JWT verification
 * used in OAuth2/OIDC flows.
 *
 * @remarks
 * This interface abstracts cryptographic operations needed for:
 * - PKCE challenge/verifier generation
 * - JWT token validation
 * - Base64URL encoding/decoding
 * - Secure random number generation
 *
 * @example
 * ```typescript
 * class MyCrypto implements Crypto<Uint8Array> {
 *   base64URLEncode(value: Uint8Array): string {
 *     // Implementation
 *   }
 *   // ... other implementations
 * }
 * ```
 */
export interface Crypto<T = any> {
  /**
   * Decode the provided data encoded in base64url format.
   *
   * @param value - Data to be decoded.
   *
   * @returns Decoded data.
   */
  base64URLDecode(value: string): string;

  /**
   * Encode the provided data in base64url format.
   *
   * @param value - Data to be encoded.
   *
   * @returns Encoded data.
   */
  base64URLEncode(value: T): string;

  /**
   * Generate random bytes.
   *
   * @param length - Length of the random bytes to be generated.
   *
   * @returns Random bytes.
   */
  generateRandomBytes(length: number): T;

  /**
   * Hash the provided data using SHA-256.
   *
   * @param data - Data to be hashed.
   *
   * @returns Hashed data.
   */
  hashSha256(data: string): T | Promise<T>;

  /**
   * Verify the provided JWT.
   *
   * @param idToken - ID Token to be verified.
   * @param jwk - JWK to be used for verification.
   * @param algorithms - Algorithms to be used for verification.
   * @param clientId - Client ID to be used for verification.
   * @param issuer - Issuer to be used for verification.
   * @param subject - Subject to be used for verification.
   * @param clockTolerance - Clock tolerance to be used for verification.
   *
   * @returns True if the ID Token is valid.
   *
   * @throws if the id_token is invalid.
   */
  verifyJwt(
    idToken: string,
    jwk: JWKInterface,
    algorithms: string[],
    clientId: string,
    issuer: string,
    subject: string,
    clockTolerance?: number,
    validateJwtIssuer?: boolean,
  ): Promise<boolean>;
}
