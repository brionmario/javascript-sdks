// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import {defineComponent, h, shallowRef} from 'vue';
import useUser from '../../composables/useUser';
import {USER_KEY} from '../../keys';
import type {UserContextValue} from '../../models/contexts';

function createMockUserContext(overrides: Partial<UserContextValue> = {}): UserContextValue {
  return {
    profile: shallowRef(null),
    flattenedProfile: shallowRef(null),
    schemas: shallowRef([]),
    updateProfile: vi.fn(),
    revalidateProfile: vi.fn(),
    ...overrides,
  } as unknown as UserContextValue;
}

describe('useUser', () => {
  it('should return the UserContextValue when called inside a provider', () => {
    const mockContext = createMockUserContext();
    let result: UserContextValue | undefined;

    const TestChild = defineComponent({
      setup() {
        result = useUser();
        return () => h('div', 'test');
      },
    });

    mount(TestChild, {
      global: {
        provide: {
          [USER_KEY as symbol]: mockContext,
        },
      },
    });

    expect(result).toBeDefined();
    expect(result.profile.value).toBeNull();
  });

  it('should throw an error when called outside of ThunderIDProvider', () => {
    const TestChild = defineComponent({
      setup() {
        useUser();
        return () => h('div', 'test');
      },
    });

    expect(() => {
      mount(TestChild);
    }).toThrow('[ThunderID] useUser() was called outside of <ThunderIDProvider>');
  });

  it('should expose updateProfile and revalidateProfile methods', () => {
    const mockContext = createMockUserContext();
    let result: UserContextValue | undefined;

    const TestChild = defineComponent({
      setup() {
        result = useUser();
        return () => h('div', 'test');
      },
    });

    mount(TestChild, {
      global: {
        provide: {
          [USER_KEY as symbol]: mockContext,
        },
      },
    });

    expect(typeof result.updateProfile).toBe('function');
    expect(typeof result.revalidateProfile).toBe('function');
  });
});
