// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Group, Preferences} from '@thunderid/browser';
import {FC, ReactElement, ReactNode} from 'react';
import useTranslation from '../../../../hooks/useTranslation';
import DataTable, {DataTableColumn} from '../../../primitives/DataTable/DataTable';
import AdminSection from '../shared/AdminSection';

export interface BaseGroupListProps {
  /**
   * Controls rendered next to the title, such as a button that opens `GroupCreate`.
   */
  actions?: ReactNode;
  className?: string;
  description?: string;
  error?: string | null;
  groups: Group[];
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
   * Called when a group is chosen. Rows are selectable only when set.
   */
  onSelect?: (group: Group) => void;
  preferences?: Preferences;
  selectedGroupId?: string;
  /**
   * Heading of the list. Pass an empty string to hide it.
   */
  title?: string;
  totalResults?: number;
}

/**
 * Lists groups with their description and organization unit. Holds no data of its own: pass the
 * page of groups and handle selection and pagination.
 */
const BaseGroupList: FC<BaseGroupListProps> = ({
  actions,
  className,
  description,
  error = null,
  groups,
  isLoading = false,
  limit = 20,
  offset = 0,
  onPageChange,
  onSelect,
  preferences,
  selectedGroupId,
  title,
  totalResults,
}: BaseGroupListProps): ReactElement => {
  const {t} = useTranslation(preferences?.i18n);

  const columns: DataTableColumn<Group>[] = [
    {header: t('admin.groups.list.columns.name'), id: 'name', render: (group: Group): ReactNode => group.name},
    {
      header: t('admin.groups.list.columns.description'),
      id: 'description',
      render: (group: Group): ReactNode => group.description ?? '',
    },
    {
      header: t('admin.common.columns.organization_unit'),
      id: 'ou',
      render: (group: Group): ReactNode => group.ouHandle ?? group.ouId,
    },
  ];

  return (
    <AdminSection
      block="group-list"
      className={className}
      title={title ?? t('admin.groups.list.title')}
      description={description}
      actions={actions}
      preferences={preferences}
    >
      <DataTable
        caption={title?.length ? title : t('admin.groups.list.title')}
        columns={columns}
        rows={groups}
        getRowId={(group: Group): string => group.id}
        isLoading={isLoading}
        error={error}
        emptyText={t('admin.groups.list.empty')}
        onRowClick={onSelect}
        selectedRowId={selectedGroupId}
        pagination={
          onPageChange ? {limit, offset, onChange: onPageChange, total: totalResults ?? groups.length} : undefined
        }
      />
    </AdminSection>
  );
};

export default BaseGroupList;
