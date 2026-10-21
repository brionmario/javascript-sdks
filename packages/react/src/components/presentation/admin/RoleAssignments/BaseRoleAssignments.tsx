// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Preferences, RoleAssigneeType, RoleAssignment, RoleAssignmentInput} from '@thunderid/browser';
import {FC, ReactElement, ReactNode} from 'react';
import useTranslation from '../../../../hooks/useTranslation';
import Button from '../../../primitives/Button/Button';
import DataTable, {DataTableColumn} from '../../../primitives/DataTable/DataTable';
import AdminSection from '../shared/AdminSection';
import IdentityPicker, {IdentityCandidate} from '../shared/IdentityPicker';

export interface BaseRoleAssignmentsProps {
  assignments: RoleAssignment[];
  /**
   * The identities the role can be assigned to, keyed by assignee type. Assigning is hidden when omitted.
   */
  candidates?: Partial<Record<RoleAssigneeType, IdentityCandidate[]>>;
  className?: string;
  description?: string;
  error?: string | null;
  isLoading?: boolean;
  isMutating?: boolean;
  onAssign?: (assignment: RoleAssignmentInput) => void;
  /**
   * Removes an assignment. The remove action is hidden when omitted.
   */
  onUnassign?: (assignment: RoleAssignment) => void;
  preferences?: Preferences;
  title?: string;
}

/**
 * Lists the users, groups and agents a role is assigned to, and lets the caller assign and unassign
 * it. Holds no data of its own.
 */
const BaseRoleAssignments: FC<BaseRoleAssignmentsProps> = ({
  assignments,
  candidates,
  className,
  description,
  error = null,
  isLoading = false,
  isMutating = false,
  onAssign,
  onUnassign,
  preferences,
  title,
}: BaseRoleAssignmentsProps): ReactElement => {
  const {t} = useTranslation(preferences?.i18n);

  const columns: DataTableColumn<RoleAssignment>[] = [
    {
      header: t('admin.roles.assignments.columns.assignee'),
      id: 'assignee',
      render: (assignment: RoleAssignment): ReactNode => assignment.display ?? assignment.id,
    },
    {
      header: t('admin.roles.assignments.columns.type'),
      id: 'type',
      render: (assignment: RoleAssignment): ReactNode => t(`admin.common.identity_types.${assignment.type}`),
    },
  ];

  if (onUnassign) {
    columns.push({
      header: t('admin.common.columns.actions'),
      id: 'actions',
      render: (assignment: RoleAssignment): ReactNode => (
        <Button
          variant="text"
          color="error"
          size="small"
          disabled={isMutating}
          aria-label={t('admin.roles.assignments.remove_label', {name: assignment.display ?? assignment.id})}
          onClick={(): void => onUnassign(assignment)}
        >
          {t('admin.common.actions.remove')}
        </Button>
      ),
    });
  }

  return (
    <AdminSection
      block="role-assignments"
      className={className}
      title={title ?? t('admin.roles.assignments.title')}
      description={description}
      headingLevel={3}
      preferences={preferences}
    >
      {onAssign && candidates && (
        <IdentityPicker<RoleAssigneeType>
          addLabel={t('admin.roles.assignments.add')}
          candidates={candidates}
          excludedIds={assignments.map((assignment: RoleAssignment) => assignment.id)}
          isSubmitting={isMutating}
          onAdd={onAssign}
          types={(['user', 'group', 'agent', 'app'] as RoleAssigneeType[])
            .filter((type: RoleAssigneeType) => candidates[type] !== undefined)
            .map((type: RoleAssigneeType) => ({label: t(`admin.common.identity_types.${type}`), value: type}))}
        />
      )}
      <DataTable
        caption={title?.length ? title : t('admin.roles.assignments.title')}
        columns={columns}
        rows={assignments}
        getRowId={(assignment: RoleAssignment): string => `${assignment.type}:${assignment.id}`}
        isLoading={isLoading}
        error={error}
        emptyText={t('admin.roles.assignments.empty')}
      />
    </AdminSection>
  );
};

export default BaseRoleAssignments;
