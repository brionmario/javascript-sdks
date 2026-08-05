// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, it, expect} from 'vitest';
import ThunderIDRuntimeError from '../../errors/ThunderIDRuntimeError';
import resolveFieldName from '../resolveFieldName';

describe('resolveFieldName', () => {
  it('should return the field.param when provided', () => {
    const field: {param: string} = {param: 'username'};
    expect(resolveFieldName(field)).toBe('username');
  });

  it('should return the field.param as-is (without trimming)', () => {
    const field: {param: string} = {param: '  custom_param  '};
    expect(resolveFieldName(field)).toBe('  custom_param  ');
  });

  it('should throw ThunderIDRuntimeError when field.param is an empty string', () => {
    const field: {param: string} = {param: ''};
    expect(() => resolveFieldName(field)).toThrow(ThunderIDRuntimeError);
    expect(() => resolveFieldName(field)).toThrow('Field name is not supported');
  });

  it('should throw ThunderIDRuntimeError when field.param is missing', () => {
    const field: {somethingElse: string} = {somethingElse: 'value'} as any;
    expect(() => resolveFieldName(field)).toThrow(ThunderIDRuntimeError);
    expect(() => resolveFieldName(field)).toThrow('Field name is not supported');
  });

  it('should throw ThunderIDRuntimeError when field.param is null', () => {
    const field: {param: null} = {param: null} as any;
    expect(() => resolveFieldName(field)).toThrow(ThunderIDRuntimeError);
  });

  it('should throw a TypeError when field itself is undefined (current behavior)', () => {
    expect(() => resolveFieldName(undefined as any)).toThrow(TypeError);
  });
});
