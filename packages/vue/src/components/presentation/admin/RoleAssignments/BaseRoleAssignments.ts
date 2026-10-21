// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {RoleAssigneeType, RoleAssignment, RoleAssignmentInput, Preferences} from '@thunderid/browser';
import {type Component, type PropType, type VNode, type VNodeChild, defineComponent, h} from 'vue';
import Button from '../../../primitives/Button/Button';
import DataTable, {type DataTableColumn} from '../../../primitives/DataTable/DataTable';
import AdminSection from '../shared/AdminSection';
import IdentityPicker, {type IdentityCandidate} from '../shared/IdentityPicker';
import useAdminTranslation, {type AdminTranslate} from '../shared/useAdminTranslation';

type BaseRoleAssignmentsProps = Readonly<{
  candidates: Partial<Record<RoleAssigneeType, IdentityCandidate[]>> | undefined;
  className: string;
  description: string | undefined;
  error: string | null;
  isLoading: boolean;
  isMutating: boolean;
  assignments: RoleAssignment[];
  onAssign: ((assignment: RoleAssignmentInput) => void) | undefined;
  onUnassign: ((assignment: RoleAssignment) => void) | undefined;
  preferences: Preferences | undefined;
  title: string | undefined;
}>;

const ASSIGNEE_TYPES: RoleAssigneeType[] = ['user', 'group', 'agent', 'app'];

/**
 * Lists the users, groups, apps and agents a role is assigned to and optionally assigns and unassigns
 * it. Holds no data of its own: pass the assignments, the identities that can be assigned, and handle
 * the changes.
 */
const BaseRoleAssignments: Component = defineComponent({
  name: 'BaseRoleAssignments',
  props: {
    /** The role's assignments. */
    assignments: {required: true, type: Array as PropType<RoleAssignment[]>},
    /**
     * Identities the role can be assigned to, keyed by assignee type. Only the types present are
     * offered. The assign form is shown only when this and `onAssign` are set.
     */
    candidates: {
      default: undefined,
      type: Object as PropType<Partial<Record<RoleAssigneeType, IdentityCandidate[]>>>,
    },
    /** Extra CSS class added to the root element. */
    className: {default: '', type: String},
    /** Text shown under the title. */
    description: {default: undefined, type: String},
    /** An error message, already translated. */
    error: {default: null, type: String as PropType<string | null>},
    isLoading: {default: false, type: Boolean},
    /** Whether an add or remove is in flight. */
    isMutating: {default: false, type: Boolean},
    /** Assigns the role. Also available as `@assign`. */
    onAssign: {default: undefined, type: Function as PropType<(assignment: RoleAssignmentInput) => void>},
    /** Removes an assignment. The remove buttons are shown only when set. Also available as `@unassign`. */
    onUnassign: {default: undefined, type: Function as PropType<(assignment: RoleAssignment) => void>},
    /** Component-level preferences, for example `i18n.bundles` overrides. */
    preferences: {default: undefined, type: Object as PropType<Preferences>},
    /** Heading of the section. Pass an empty string to hide it. */
    title: {default: undefined, type: String},
  },
  setup(props: BaseRoleAssignmentsProps): () => VNode {
    const t: AdminTranslate = useAdminTranslation(() => props.preferences);

    return (): VNode => {
      const {candidates, onAssign, onUnassign} = props;
      const columns: DataTableColumn<RoleAssignment>[] = [
        {
          header: t('admin.roles.assignments.columns.assignee'),
          id: 'assignee',
          render: (assignment: RoleAssignment): VNodeChild => assignment.display ?? assignment.id,
        },
        {
          header: t('admin.roles.assignments.columns.type'),
          id: 'type',
          render: (assignment: RoleAssignment): VNodeChild => t(`admin.common.identity_types.${assignment.type}`),
        },
      ];

      if (onUnassign) {
        columns.push({
          header: t('admin.common.columns.actions'),
          id: 'actions',
          render: (assignment: RoleAssignment): VNodeChild =>
            h(
              Button,
              {
                'aria-label': t('admin.roles.assignments.remove_label', {name: assignment.display ?? assignment.id}),
                color: 'danger',
                disabled: props.isMutating,
                onClick: (): void => onUnassign(assignment),
                size: 'small',
                variant: 'text',
              },
              {default: (): string => t('admin.common.actions.remove')},
            ),
        });
      }

      return h(
        AdminSection,
        {
          block: 'role-assignments',
          className: props.className,
          description: props.description,
          headingLevel: 3,
          title: props.title ?? t('admin.roles.assignments.title'),
        },
        {
          default: (): (VNode | null)[] => [
            onAssign && candidates
              ? h(IdentityPicker, {
                  addLabel: t('admin.roles.assignments.add'),
                  candidates,
                  excludedIds: props.assignments.map((assignment: RoleAssignment) => assignment.id),
                  isSubmitting: props.isMutating,
                  onAdd: onAssign,
                  t,
                  types: ASSIGNEE_TYPES.filter((type: RoleAssigneeType) => candidates[type] !== undefined).map(
                    (type: RoleAssigneeType) => ({label: t(`admin.common.identity_types.${type}`), value: type}),
                  ),
                })
              : null,
            h(DataTable, {
              caption: props.title?.length ? props.title : t('admin.roles.assignments.title'),
              columns,
              emptyText: t('admin.roles.assignments.empty'),
              error: props.error,
              getRowId: (assignment: RoleAssignment): string => `${assignment.type}:${assignment.id}`,
              isLoading: props.isLoading,
              rows: props.assignments,
              t,
            }),
          ],
        },
      );
    };
  },
});

export default BaseRoleAssignments;
