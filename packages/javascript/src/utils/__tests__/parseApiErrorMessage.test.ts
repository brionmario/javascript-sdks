// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import parseApiErrorMessage from '../parseApiErrorMessage';

describe('parseApiErrorMessage', () => {
  it('should return message.defaultValue when present', () => {
    const errorText: string = JSON.stringify({
      code: 'SSE-5000',
      description: {defaultValue: 'An unexpected error occurred while processing the request', key: 'error.desc'},
      message: {defaultValue: 'Internal server error', key: 'error.msg'},
    });
    expect(parseApiErrorMessage(errorText)).toBe('Internal server error');
  });

  it('should fall back to message.defaultValue when description is absent', () => {
    const errorText: string = JSON.stringify({
      code: 'SSE-5000',
      message: {defaultValue: 'Internal server error', key: 'error.msg'},
    });
    expect(parseApiErrorMessage(errorText)).toBe('Internal server error');
  });

  it('should return raw text when the response is plain text (not JSON)', () => {
    expect(parseApiErrorMessage('Invalid credentials')).toBe('Invalid credentials');
  });

  it('should return raw text when JSON does not contain known fields', () => {
    const errorText: string = JSON.stringify({code: 'ERR-001', error: 'something'});
    expect(parseApiErrorMessage(errorText)).toBe(errorText);
  });

  it('should fall back to description.defaultValue when message.defaultValue is an empty string', () => {
    const errorText: string = JSON.stringify({
      code: 'SSE-5000',
      description: {defaultValue: 'An unexpected error occurred while processing the request', key: 'error.desc'},
      message: {defaultValue: '', key: 'error.msg'},
    });
    expect(parseApiErrorMessage(errorText)).toBe('An unexpected error occurred while processing the request');
  });

  it('should return raw text when both defaultValue fields are absent', () => {
    const errorText: string = JSON.stringify({
      code: 'SSE-5000',
      description: {key: 'error.desc'},
      message: {key: 'error.msg'},
    });
    expect(parseApiErrorMessage(errorText)).toBe(errorText);
  });

  it('should return raw text for malformed JSON', () => {
    expect(parseApiErrorMessage('{not valid json')).toBe('{not valid json');
  });

  it('should return empty string when given empty string', () => {
    expect(parseApiErrorMessage('')).toBe('');
  });
});
