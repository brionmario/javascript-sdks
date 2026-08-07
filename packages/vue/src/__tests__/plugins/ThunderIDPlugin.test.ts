// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it, vi} from 'vitest';
import {createApp, h} from 'vue';
import ThunderIDPlugin from '../../plugins/ThunderIDPlugin';
import {injectStyles} from '../../styles/injectStyles';

vi.mock('../../styles/injectStyles', () => ({
  injectStyles: vi.fn(),
}));

describe('ThunderIDPlugin', () => {
  it('should be a valid Vue plugin with an install method', () => {
    expect(ThunderIDPlugin).toBeDefined();
    expect(typeof ThunderIDPlugin.install).toBe('function');
  });

  it('should install without errors when given a Vue app', () => {
    const app = createApp({
      render() {
        return h('div', 'test');
      },
    });

    expect(() => {
      app.use(ThunderIDPlugin);
    }).not.toThrow();
  });

  it('should register ThunderIDProvider as a global component', () => {
    const app = createApp({
      render() {
        return h('div', 'test');
      },
    });

    app.use(ThunderIDPlugin);

    // Vue 3 stores global component registrations internally
    // We verify the component was registered by checking the app's component resolution
    expect(app.component('ThunderIDProvider')).toBeDefined();
  });

  it('forwards the cspNonce option to injectStyles', () => {
    const app = createApp({
      render() {
        return h('div', 'test');
      },
    });

    app.use(ThunderIDPlugin, {cspNonce: 'abc123'});

    expect(injectStyles).toHaveBeenCalledWith(undefined, 'abc123');
  });
});
