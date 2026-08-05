// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Interface representing the configuration for an agent.
 */
export interface AgentConfig {
  /**
   * The unique identifier for the agent
   */
  agentID: string;
  /**
   * The secret credential for the agent
   */
  agentSecret: string;
  /**
   * The authenticator name to match during the embedded sign-in flow.
   * Defaults to {@link AgentConfig.DEFAULT_AUTHENTICATOR_NAME} if not provided.
   */
  authenticatorName?: string;
}

/**
 * Namespace that holds constants related to {@link AgentConfig}.
 */
export namespace AgentConfig {
  /**
   * Default authenticator name used when none is specified.
   */
  export const DEFAULT_AUTHENTICATOR_NAME = 'Username & Password';
}
