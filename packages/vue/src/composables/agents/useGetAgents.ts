// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AgentQueryKeys, getAgents, type AgentListResponse} from '@thunderid/browser';
import {type MaybeRefOrGetter, toValue} from 'vue';
import useManagementEndpoint, {type ManagementEndpoint} from '../useManagementEndpoint';
import useResourceQuery, {type ResourceQueryOptions, type ResourceQueryResult} from '../useResourceQuery';

/**
 * Parameters for {@link useGetAgents}.
 */
export interface UseGetAgentsParams {
  limit?: number;
  offset?: number;
}

/**
 * Fetches a page of agents.
 *
 * @param params - Pagination parameters. A ref or getter refetches when it changes.
 * @param options - Query options, including a per-composable `fetcher`.
 * @returns The query state.
 */
const useGetAgents = (
  params: MaybeRefOrGetter<UseGetAgentsParams> = {},
  options?: ResourceQueryOptions,
): ResourceQueryResult<AgentListResponse> => {
  const endpoint: ManagementEndpoint = useManagementEndpoint('agents');

  return useResourceQuery(
    () => {
      const {limit, offset} = toValue(params);

      return [AgentQueryKeys.AGENTS, {limit, offset}];
    },
    (fetcher) => {
      const {limit, offset} = toValue(params);

      return getAgents({...endpoint, fetcher, limit, offset});
    },
    options,
  );
};

export default useGetAgents;
