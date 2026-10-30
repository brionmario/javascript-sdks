// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {EmbeddedFlowSessionData} from '../../models/embedded-flow';

/**
 * The part of a flow step response that reports SSO sessions.
 */
interface FlowSessionUpdate {
  clearedSessions?: string[];
  sessionData?: EmbeddedFlowSessionData[];
}

// The SSO sessions each authorization request's flow responses returned, held in memory until the
// callback posts them. A session can start on any step, not only the last, so every response is read.
// They are never persisted, so a reload in the middle of the flow drops them.
const collectedSessions = new Map<string, Map<string, EmbeddedFlowSessionData>>();

/**
 * Holds the sessions a flow step started under its authorization request, and drops the ones it ended.
 */
export const collectFlowSessions = (authId: string, step: FlowSessionUpdate): void => {
  if (!step.sessionData?.length && !step.clearedSessions?.length) {
    return;
  }
  const held: Map<string, EmbeddedFlowSessionData> =
    collectedSessions.get(authId) ?? new Map<string, EmbeddedFlowSessionData>();
  step.sessionData?.forEach(({flowIdentifier, sessionHandle}: EmbeddedFlowSessionData) => {
    held.set(flowIdentifier, {flowIdentifier, sessionHandle});
  });
  step.clearedSessions?.forEach((flowIdentifier: string) => held.delete(flowIdentifier));
  collectedSessions.set(authId, held);
};

/**
 * Returns the sessions held for an authorization request and forgets them.
 */
export const takeFlowSessions = (authId: string): EmbeddedFlowSessionData[] => {
  const held: Map<string, EmbeddedFlowSessionData> | undefined = collectedSessions.get(authId);
  collectedSessions.delete(authId);

  return held ? [...held.values()] : [];
};
