// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {toManagementErrorMessage} from '@thunderid/browser';
import {FC, ReactElement, useState} from 'react';
import BaseAgentList, {BaseAgentListProps} from './BaseAgentList';
import useGetAgents from '../../../../hooks/agents/useGetAgents';
import useTranslation from '../../../../hooks/useTranslation';

export type AgentListProps = Omit<
  BaseAgentListProps,
  'agents' | 'error' | 'isLoading' | 'offset' | 'onPageChange' | 'totalResults'
>;

/**
 * Lists the agents the signed-in user is allowed to see, a page at a time.
 *
 * @example
 * ```tsx
 * <AgentList onSelect={(agent) => setSelectedAgentId(agent.id)} />
 * ```
 */
const AgentList: FC<AgentListProps> = ({limit = 20, preferences, ...rest}: AgentListProps): ReactElement => {
  const {t} = useTranslation(preferences?.i18n);
  const [offset, setOffset] = useState<number>(0);
  const {data, error, isLoading} = useGetAgents({limit, offset});

  return (
    <BaseAgentList
      agents={data?.agents ?? []}
      totalResults={data?.totalResults}
      isLoading={isLoading}
      error={toManagementErrorMessage(t, error, 'admin.agents.list.error')}
      limit={limit}
      offset={offset}
      onPageChange={setOffset}
      preferences={preferences}
      {...rest}
    />
  );
};

export default AgentList;
