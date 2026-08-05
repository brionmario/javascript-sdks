// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {exportJWK, generateKeyPair, SignJWT} from 'jose';
import {DefaultCrypto} from '../DefaultCrypto';
import TokenConstants from '../constants/TokenConstants';
import {JWKInterface} from '../models/crypto';

describe('DefaultCrypto.verifyJwt with ML-DSA (AKP JWKs)', (): void => {
  it.each(['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'] as const)(
    'verifies an id_token signed with %s against its AKP JWK',
    async (alg): Promise<void> => {
      const {publicKey, privateKey} = await generateKeyPair(alg, {extractable: true});
      const jwk = (await exportJWK(publicKey)) as unknown as JWKInterface;
      jwk.alg = alg;
      jwk.kid = `test-${alg}`;
      jwk.use = 'sig';

      const idToken: string = await new SignJWT({})
        .setProtectedHeader({alg, kid: jwk.kid})
        .setIssuedAt()
        .setIssuer('https://issuer.example')
        .setAudience('client-id')
        .setSubject('user-id')
        .setExpirationTime('1h')
        .sign(privateKey);

      const crypto = new DefaultCrypto();
      const result: boolean = await crypto.verifyJwt(
        idToken,
        jwk,
        TokenConstants.SignatureValidation.SUPPORTED_ALGORITHMS as unknown as string[],
        'client-id',
        'https://issuer.example',
        'user-id',
      );

      expect(result).toBe(true);
    },
  );

  it('rejects an ML-DSA id_token with a tampered signature', async (): Promise<void> => {
    const alg = 'ML-DSA-65';
    const {publicKey, privateKey} = await generateKeyPair(alg, {extractable: true});
    const jwk = (await exportJWK(publicKey)) as unknown as JWKInterface;
    jwk.alg = alg;
    jwk.kid = 'test-tampered';
    jwk.use = 'sig';

    const idToken: string = await new SignJWT({})
      .setProtectedHeader({alg, kid: jwk.kid})
      .setIssuedAt()
      .setIssuer('https://issuer.example')
      .setAudience('client-id')
      .setSubject('user-id')
      .setExpirationTime('1h')
      .sign(privateKey);

    const parts: string[] = idToken.split('.');
    const tamperedSignature: string = parts[2].slice(0, -4) + (parts[2].endsWith('AAAA') ? 'BBBB' : 'AAAA');
    const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedSignature}`;

    const crypto = new DefaultCrypto();
    await expect(
      crypto.verifyJwt(
        tamperedToken,
        jwk,
        TokenConstants.SignatureValidation.SUPPORTED_ALGORITHMS as unknown as string[],
        'client-id',
        'https://issuer.example',
        'user-id',
      ),
    ).rejects.toThrow();
  });
});
