// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {BasicAgent, Preferences} from '@thunderid/browser';
import {FC, ReactElement, ReactNode} from 'react';
import useTranslation from '../../../../hooks/useTranslation';
import DataTable, {DataTableColumn} from '../../../primitives/DataTable/DataTable';
import AdminSection from '../shared/AdminSection';

export interface BaseAgentListProps {
  /**
   * Controls rendered next to the title, such as a button that opens `AgentCreate`.
   */
  actions?: ReactNode;
  className?: string;
  description?: string;
  agents: BasicAgent[];
  error?: string | null;
  isLoading?: boolean;
  /**
   * Page size.
   * @default 20
   */
  limit?: number;
  offset?: number;
  /**
   * Called with the offset of the page to show. Pagination is hidden when omitted.
   */
  onPageChange?: (offset: number) => void;
  /**
   * Called when an agent is chosen. Rows are selectable only when set.
   */
  onSelect?: (agent: BasicAgent) => void;
  preferences?: Preferences;
  selectedAgentId?: string;
  /**
   * Heading of the list. Pass an empty string to hide it.
   */
  title?: string;
  totalResults?: number;
}

/**
 * Lists agents with their type, client and organization unit. Holds no data of its own: pass the
 * page of agents and handle selection and pagination.
 */
const BaseAgentList: FC<BaseAgentListProps> = ({
  actions,
  agents,
  className,
  description,
  error = null,
  isLoading = false,
  limit = 20,
  offset = 0,
  onPageChange,
  onSelect,
  preferences,
  selectedAgentId,
  title,
  totalResults,
}: BaseAgentListProps): ReactElement => {
  const {t} = useTranslation(preferences?.i18n);

  const columns: DataTableColumn<BasicAgent>[] = [
    {header: t('admin.agents.list.columns.name'), id: 'name', render: (agent: BasicAgent): ReactNode => agent.name},
    {header: t('admin.agents.list.columns.type'), id: 'type', render: (agent: BasicAgent): ReactNode => agent.type},
    {
      header: t('admin.agents.list.columns.client_id'),
      id: 'clientId',
      render: (agent: BasicAgent): ReactNode => <code>{agent.clientId ?? ''}</code>,
    },
    {
      header: t('admin.common.columns.organization_unit'),
      id: 'ou',
      render: (agent: BasicAgent): ReactNode => agent.ouHandle ?? agent.ouId,
    },
  ];

  return (
    <AdminSection
      block="agent-list"
      className={className}
      title={title ?? t('admin.agents.list.title')}
      description={description}
      actions={actions}
      preferences={preferences}
    >
      <DataTable
        caption={title?.length ? title : t('admin.agents.list.title')}
        columns={columns}
        rows={agents}
        getRowId={(agent: BasicAgent): string => agent.id}
        isLoading={isLoading}
        error={error}
        emptyText={t('admin.agents.list.empty')}
        onRowClick={onSelect}
        selectedRowId={selectedAgentId}
        pagination={
          onPageChange ? {limit, offset, onChange: onPageChange, total: totalResults ?? agents.length} : undefined
        }
      />
    </AdminSection>
  );
};

export default BaseAgentList;
