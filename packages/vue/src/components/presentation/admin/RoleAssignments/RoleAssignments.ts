// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {resolveManagedIdentityName, toManagementErrorMessage} from '@thunderid/browser';
import type {
  AgentListResponse,
  BasicAgent,
  Group,
  GroupListResponse,
  ManagedUser,
  ManagedUserListResponse,
  Preferences,
  RoleAssignment,
  RoleAssignmentInput,
  RoleAssignmentListResponse,
} from '@thunderid/browser';
import {type Component, type PropType, type VNode, defineComponent, h} from 'vue';
import BaseRoleAssignments from './BaseRoleAssignments';
import useGetAgents from '../../../../composables/agents/useGetAgents';
import useGetGroups from '../../../../composables/groups/useGetGroups';
import useAddRoleAssignments, {
  type RoleAssignmentsVariables,
} from '../../../../composables/roles/useAddRoleAssignments';
import useGetRoleAssignments from '../../../../composables/roles/useGetRoleAssignments';
import useRemoveRoleAssignments from '../../../../composables/roles/useRemoveRoleAssignments';
import type {ResourceMutationResult} from '../../../../composables/useResourceMutation';
import type {ResourceQueryResult} from '../../../../composables/useResourceQuery';
import useGetUsers from '../../../../composables/users/useGetUsers';
import type {IdentityCandidate} from '../shared/IdentityPicker';
import useAdminTranslation, {type AdminTranslate} from '../shared/useAdminTranslation';

type RoleAssignmentsProps = Readonly<{
  className: string;
  description: string | undefined;
  editable: boolean;
  preferences: Preferences | undefined;
  roleId: string;
  title: string | undefined;
}>;

/**
 * Lists who a role is assigned to and, unless `editable` is `false`, lets the signed-in user assign it
 * to users, groups and agents or remove assignments.
 *
 * @example
 * ```vue
 * <RoleAssignments :role-id="roleId" />
 * ```
 */
const RoleAssignments: Component = defineComponent({
  name: 'RoleAssignments',
  props: {
    /** Extra CSS class added to the root element. */
    className: {default: '', type: String},
    /** Text shown under the title. */
    description: {default: undefined, type: String},
    /** Whether assignments can be added and removed. */
    editable: {default: false, type: Boolean},
    /** Component-level preferences, for example `i18n.bundles` overrides. */
    preferences: {default: undefined, type: Object as PropType<Preferences>},
    /** Identifier of the role. */
    roleId: {required: true, type: String},
    /** Heading of the section. Pass an empty string to hide it. */
    title: {default: undefined, type: String},
  },
  setup(props: RoleAssignmentsProps): () => VNode {
    const t: AdminTranslate = useAdminTranslation(() => props.preferences);
    const assignments: ResourceQueryResult<RoleAssignmentListResponse> = useGetRoleAssignments(() => props.roleId, {
      limit: 100,
    });
    const editable = (): boolean => props.editable;
    const users: ResourceQueryResult<ManagedUserListResponse> = useGetUsers({limit: 100}, {enabled: editable});
    const groups: ResourceQueryResult<GroupListResponse> = useGetGroups({limit: 100}, {enabled: editable});
    const agents: ResourceQueryResult<AgentListResponse> = useGetAgents({limit: 100}, {enabled: editable});
    const assign: ResourceMutationResult<void, RoleAssignmentsVariables> = useAddRoleAssignments();
    const unassign: ResourceMutationResult<void, RoleAssignmentsVariables> = useRemoveRoleAssignments();

    return (): VNode => {
      const candidates: Partial<Record<'user' | 'group' | 'agent', IdentityCandidate[]>> = {
        agent: (agents.data.value?.agents ?? []).map((agent: BasicAgent) => ({id: agent.id, label: agent.name})),
        group: (groups.data.value?.groups ?? []).map((group: Group) => ({id: group.id, label: group.name})),
        user: (users.data.value?.users ?? []).map((user: ManagedUser) => ({
          id: user.id,
          label: resolveManagedIdentityName(user),
        })),
      };

      return h(BaseRoleAssignments, {
        assignments: assignments.data.value?.assignments ?? [],
        candidates: props.editable ? candidates : undefined,
        className: props.className,
        description: props.description,
        error:
          toManagementErrorMessage(t, assignments.error.value, 'admin.roles.assignments.error') ??
          toManagementErrorMessage(
            t,
            assign.error.value ?? unassign.error.value,
            'admin.roles.assignments.update_error',
          ),
        isLoading: assignments.isLoading.value,
        isMutating: assign.isLoading.value || unassign.isLoading.value,
        onAssign: props.editable
          ? (assignment: RoleAssignmentInput): void =>
              void assign.mutate({assignments: [assignment], roleId: props.roleId})
          : undefined,
        onUnassign: props.editable
          ? (assignment: RoleAssignment): void =>
              void unassign.mutate({
                assignments: [{id: assignment.id, type: assignment.type}],
                roleId: props.roleId,
              })
          : undefined,
        preferences: props.preferences,
        title: props.title,
      });
    };
  },
});

export default RoleAssignments;
