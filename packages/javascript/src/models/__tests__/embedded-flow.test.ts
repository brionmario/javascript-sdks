// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest';
import {
  EmbeddedFlowComponent,
  EmbeddedFlowComponentAction,
  EmbeddedFlowComponentType,
  EmbeddedFlowEventType,
} from '../embedded-flow';

describe('EmbeddedFlowComponentAction', () => {
  it('accepts a ref-only action (defaults to SUBMIT semantics at the renderer)', () => {
    const action: EmbeddedFlowComponentAction = {ref: 'action_signup'};
    expect(action.ref).toBe('action_signup');
    expect(action.eventType).toBeUndefined();
  });

  it('accepts an explicit TRIGGER eventType', () => {
    const action: EmbeddedFlowComponentAction = {
      eventType: EmbeddedFlowEventType.Trigger,
      ref: 'action_signup',
    };
    expect(action.eventType).toBe('TRIGGER');
  });

  it('accepts a string eventType for forward-compatibility', () => {
    const action: EmbeddedFlowComponentAction = {
      eventType: 'CUSTOM_EVENT',
      ref: 'action_signup',
    };
    expect(action.eventType).toBe('CUSTOM_EVENT');
  });
});

describe('EmbeddedFlowComponent.action', () => {
  it('is optional — a plain rich-text component has no action', () => {
    const component: EmbeddedFlowComponent = {
      id: 'text_1',
      label: '<p>Hello</p>',
      type: EmbeddedFlowComponentType.RichText,
    };
    expect(component.action).toBeUndefined();
  });

  it('can carry an action wiring on a RICH_TEXT component', () => {
    const component: EmbeddedFlowComponent = {
      action: {eventType: EmbeddedFlowEventType.Submit, ref: 'action_signup'},
      id: 'text_1',
      label: '<p>Have an account? <a data-action-ref="action_signup">Sign in</a></p>',
      type: EmbeddedFlowComponentType.RichText,
    };
    expect(component.action?.ref).toBe('action_signup');
    expect(component.action?.eventType).toBe('SUBMIT');
  });
});
