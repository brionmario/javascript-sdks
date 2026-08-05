// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {mount} from '@vue/test-utils';

import {describe, expect, it, vi} from 'vitest';
import {defineComponent, h, ref} from 'vue';
import useFlow from '../../composables/useFlow';
import useFlowMeta from '../../composables/useFlowMeta';
import useI18n from '../../composables/useI18n';
import useTheme from '../../composables/useTheme';
import {FLOW_KEY, FLOW_META_KEY, THEME_KEY, I18N_KEY} from '../../keys';
import type {FlowContextValue, FlowMetaContextValue, ThemeContextValue, I18nContextValue} from '../../models/contexts';

describe('useFlow', () => {
  it('should return the FlowContextValue when called inside a provider', () => {
    const mockContext: Partial<FlowContextValue> = {
      currentStep: ref('signin') as any,
      messages: ref([]) as any,
      isLoading: ref(false) as any,
      navigateToFlow: vi.fn(),
    };
    let result: FlowContextValue | undefined;

    const TestChild = defineComponent({
      setup() {
        result = useFlow();
        return () => h('div', 'test');
      },
    });

    mount(TestChild, {
      global: {
        provide: {
          [FLOW_KEY as symbol]: mockContext,
        },
      },
    });

    expect(result).toBeDefined();
  });

  it('should throw an error when called outside of ThunderIDProvider', () => {
    const TestChild = defineComponent({
      setup() {
        useFlow();
        return () => h('div', 'test');
      },
    });

    expect(() => {
      mount(TestChild);
    }).toThrow('[ThunderID] useFlow() was called outside of <ThunderIDProvider>');
  });
});

describe('useFlowMeta', () => {
  it('should return the FlowMetaContextValue when called inside a provider', () => {
    const mockContext: Partial<FlowMetaContextValue> = {
      meta: ref(null) as any,
      isLoading: ref(false) as any,
      error: ref(null) as any,
      fetchFlowMeta: vi.fn(),
    };
    let result: FlowMetaContextValue | undefined;

    const TestChild = defineComponent({
      setup() {
        result = useFlowMeta();
        return () => h('div', 'test');
      },
    });

    mount(TestChild, {
      global: {
        provide: {
          [FLOW_META_KEY as symbol]: mockContext,
        },
      },
    });

    expect(result).toBeDefined();
  });

  it('should throw an error when called outside of ThunderIDProvider', () => {
    const TestChild = defineComponent({
      setup() {
        useFlowMeta();
        return () => h('div', 'test');
      },
    });

    expect(() => {
      mount(TestChild);
    }).toThrow('[ThunderID] useFlowMeta() was called outside of <ThunderIDProvider>');
  });
});

describe('useTheme', () => {
  it('should return the ThemeContextValue when called inside a provider', () => {
    const mockContext: Partial<ThemeContextValue> = {
      theme: ref({}) as any,
      colorScheme: ref('light') as any,
      direction: ref('ltr') as any,
      toggleTheme: vi.fn(),
    };
    let result: ThemeContextValue | undefined;

    const TestChild = defineComponent({
      setup() {
        result = useTheme();
        return () => h('div', 'test');
      },
    });

    mount(TestChild, {
      global: {
        provide: {
          [THEME_KEY as symbol]: mockContext,
        },
      },
    });

    expect(result).toBeDefined();
  });

  it('should throw an error when called outside of ThunderIDProvider', () => {
    const TestChild = defineComponent({
      setup() {
        useTheme();
        return () => h('div', 'test');
      },
    });

    expect(() => {
      mount(TestChild);
    }).toThrow('[ThunderID] useTheme() was called outside of <ThunderIDProvider>');
  });
});

describe('useI18n', () => {
  it('should return the I18nContextValue when called inside a provider', () => {
    const mockContext: Partial<I18nContextValue> = {
      t: vi.fn((key: string) => key),
      currentLanguage: ref('en-US') as any,
      fallbackLanguage: 'en-US',
      setLanguage: vi.fn(),
      bundles: ref({}) as any,
      injectBundles: vi.fn(),
    };
    let result: I18nContextValue | undefined;

    const TestChild = defineComponent({
      setup() {
        result = useI18n();
        return () => h('div', 'test');
      },
    });

    mount(TestChild, {
      global: {
        provide: {
          [I18N_KEY as symbol]: mockContext,
        },
      },
    });

    expect(result).toBeDefined();
    expect(typeof result.t).toBe('function');
  });

  it('should throw an error when called outside of ThunderIDProvider', () => {
    const TestChild = defineComponent({
      setup() {
        useI18n();
        return () => h('div', 'test');
      },
    });

    expect(() => {
      mount(TestChild);
    }).toThrow('[ThunderID] useI18n() was called outside of <ThunderIDProvider>');
  });
});
