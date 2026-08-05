// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import PKCEConstants from '../../constants/PKCEConstants';
import {TemporaryStore} from '../../models/store';
import generatePkceStorageKey from '../generatePkceStorageKey';

describe('generatePkceStorageKey', (): void => {
  it('should generate PKCE key with index 0 for empty temporary data', (): void => {
    const tempData: TemporaryStore = {};
    const expectedKey = `${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}0`;

    expect(generatePkceStorageKey(tempData)).toBe(expectedKey);
  });

  it('should generate PKCE key with incremented index for existing PKCE keys', (): void => {
    const tempData: TemporaryStore = {
      [`${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}1`]: 'value1',
      [`${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}2`]: 'value2',
    };
    const expectedKey = `${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}3`;

    expect(generatePkceStorageKey(tempData)).toBe(expectedKey);
  });

  it('should handle non-sequential PKCE keys', (): void => {
    const tempData: TemporaryStore = {
      [`${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}1`]: 'value1',
      [`${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}5`]: 'value5',
    };
    const expectedKey = `${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}6`;

    expect(generatePkceStorageKey(tempData)).toBe(expectedKey);
  });

  it('should ignore non-PKCE keys in temporary data', (): void => {
    const tempData: TemporaryStore = {
      [`${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}1`]: 'value1',
      'other-key': 'other-value',
    };
    const expectedKey = `${PKCEConstants.Storage.StorageKeys.CODE_VERIFIER}${PKCEConstants.Storage.StorageKeys.SEPARATOR}2`;

    expect(generatePkceStorageKey(tempData)).toBe(expectedKey);
  });
});
