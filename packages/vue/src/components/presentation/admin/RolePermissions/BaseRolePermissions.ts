// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {type Preferences, type RoleResourcePermissions, withVendorCSSClassPrefix} from '@thunderid/browser';
import {type Component, type PropType, type VNode, defineComponent, h} from 'vue';
import Alert from '../../../primitives/Alert/Alert';
import Spinner from '../../../primitives/Spinner/Spinner';
import AdminSection from '../shared/AdminSection';
import ChipList from '../shared/ChipList';
import Panel from '../shared/Panel';
import useAdminTranslation, {type AdminTranslate} from '../shared/useAdminTranslation';

type BaseRolePermissionsProps = Readonly<{
  className: string;
  description: string | undefined;
  error: string | null;
  isLoading: boolean;
  permissions: RoleResourcePermissions[];
  preferences: Preferences | undefined;
  resourceServerNames: Record<string, string> | undefined;
  title: string | undefined;
}>;

/**
 * Shows the permissions a role grants, grouped by resource server. Holds no data of its own: pass the
 * permissions.
 */
const BaseRolePermissions: Component = defineComponent({
  name: 'BaseRolePermissions',
  props: {
    /** Extra CSS class added to the root element. */
    className: {default: '', type: String},
    /** Text shown under the title. */
    description: {default: undefined, type: String},
    /** An error message, already translated. */
    error: {default: null, type: String as PropType<string | null>},
    isLoading: {default: false, type: Boolean},
    /** The permissions the role grants, per resource server. */
    permissions: {required: true, type: Array as PropType<RoleResourcePermissions[]>},
    /** Component-level preferences, for example `i18n.bundles` overrides. */
    preferences: {default: undefined, type: Object as PropType<Preferences>},
    /** Display names of resource servers, keyed by identifier. The identifier is shown otherwise. */
    resourceServerNames: {default: undefined, type: Object as PropType<Record<string, string>>},
    /** Heading of the section. Pass an empty string to hide it. */
    title: {default: undefined, type: String},
  },
  setup(props: BaseRolePermissionsProps): () => VNode {
    const t: AdminTranslate = useAdminTranslation(() => props.preferences);

    const renderContent = (): VNode | VNode[] => {
      if (props.isLoading) {
        return h('span', {class: withVendorCSSClassPrefix('admin__muted'), role: 'status'}, [
          h(Spinner, {'aria-hidden': 'true', size: 'small'}),
          t('admin.common.loading'),
        ]);
      }

      if (props.error) {
        return h(Alert, {severity: 'error'}, {default: (): string[] => [props.error!]});
      }

      const granted: RoleResourcePermissions[] = props.permissions.filter(
        (entry: RoleResourcePermissions) => entry.permissions.length > 0,
      );

      if (granted.length === 0) {
        return h('span', {class: withVendorCSSClassPrefix('admin__muted')}, t('admin.roles.permissions.empty'));
      }

      return granted.map((entry: RoleResourcePermissions) => {
        const name: string = props.resourceServerNames?.[entry.resourceServerId] ?? entry.resourceServerId;

        return h(
          Panel,
          {key: entry.resourceServerId, title: name},
          {
            default: (): VNode =>
              h(ChipList, {
                emptyText: t('admin.roles.permissions.empty'),
                items: entry.permissions.map((permission: string) => ({id: permission, label: permission})),
                label: name,
              }),
          },
        );
      });
    };

    return (): VNode =>
      h(
        AdminSection,
        {
          block: 'role-permissions',
          className: props.className,
          description: props.description,
          headingLevel: 3,
          title: props.title ?? t('admin.roles.permissions.title'),
        },
        {default: renderContent},
      );
  },
});

export default BaseRolePermissions;
