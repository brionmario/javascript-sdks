// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Preferences, RoleResourcePermissions} from '@thunderid/browser';
import {FC, ReactElement} from 'react';
import useTranslation from '../../../../hooks/useTranslation';
import Alert from '../../../primitives/Alert/Alert';
import Spinner from '../../../primitives/Spinner/Spinner';
import {ChipList, Panel} from '../shared/AdminParts';
import AdminSection from '../shared/AdminSection';
import useAdminPartStyles from '../shared/useAdminPartStyles';

export interface BaseRolePermissionsProps {
  className?: string;
  description?: string;
  error?: string | null;
  isLoading?: boolean;
  permissions: RoleResourcePermissions[];
  preferences?: Preferences;
  /**
   * Display names of resource servers, keyed by identifier. The identifier is shown when a name is missing.
   */
  resourceServerNames?: Record<string, string>;
  title?: string;
}

/**
 * Shows the permissions a role grants, grouped by resource server. Read-only, and holds no data of its own.
 */
const BaseRolePermissions: FC<BaseRolePermissionsProps> = ({
  className,
  description,
  error = null,
  isLoading = false,
  permissions,
  preferences,
  resourceServerNames,
  title,
}: BaseRolePermissionsProps): ReactElement => {
  const {t} = useTranslation(preferences?.i18n);
  const styles: Record<string, string> = useAdminPartStyles();
  const granted: RoleResourcePermissions[] = permissions.filter(
    (entry: RoleResourcePermissions) => entry.permissions.length > 0,
  );

  const renderContent = (): ReactElement => {
    if (isLoading) {
      return <Spinner size="small" />;
    }
    if (error) {
      return (
        <Alert variant="error" role="alert">
          {error}
        </Alert>
      );
    }
    if (granted.length === 0) {
      return <span className={styles['muted']}>{t('admin.roles.permissions.empty')}</span>;
    }

    return (
      <>
        {granted.map((entry: RoleResourcePermissions) => {
          const name: string = resourceServerNames?.[entry.resourceServerId] ?? entry.resourceServerId;

          return (
            <Panel key={entry.resourceServerId} title={name}>
              <ChipList
                label={name}
                emptyText={t('admin.roles.permissions.empty')}
                items={entry.permissions.map((permission: string) => ({id: permission, label: permission}))}
              />
            </Panel>
          );
        })}
      </>
    );
  };

  return (
    <AdminSection
      block="role-permissions"
      className={className}
      title={title ?? t('admin.roles.permissions.title')}
      description={description}
      headingLevel={3}
      preferences={preferences}
    >
      {renderContent()}
    </AdminSection>
  );
};

export default BaseRolePermissions;
