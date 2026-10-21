// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Preferences} from '@thunderid/browser';
import {ChangeEvent, FC, FormEvent, ReactElement, useState} from 'react';
import useTheme from '../../../../contexts/Theme/useTheme';
import useTranslation from '../../../../hooks/useTranslation';
import Alert from '../../../primitives/Alert/Alert';
import Button from '../../../primitives/Button/Button';
import TextField from '../../../primitives/TextField/TextField';
import AdminSection from '../shared/AdminSection';
import useStyles from '../shared/AdminSection.styles';

/**
 * The role {@link BaseRoleCreate} submits. The organization unit is added by the caller.
 */
export interface RoleCreateSubmission {
  description?: string;
  name: string;
}

export interface BaseRoleCreateProps {
  className?: string;
  description?: string;
  error?: string | null;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (role: RoleCreateSubmission) => void;
  preferences?: Preferences;
  title?: string;
}

/**
 * A form that collects a new role's name and description. Holds no data of its own: handle the
 * submission.
 */
const BaseRoleCreate: FC<BaseRoleCreateProps> = ({
  className,
  description,
  error = null,
  isSubmitting = false,
  onCancel,
  onSubmit,
  preferences,
  title,
}: BaseRoleCreateProps): ReactElement => {
  const {theme, colorScheme} = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme);
  const {t} = useTranslation(preferences?.i18n);
  const [name, setName] = useState<string>('');
  const [roleDescription, setRoleDescription] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit({description: roleDescription.trim() || undefined, name: name.trim()});
  };

  return (
    <AdminSection
      block="role-create"
      className={className}
      title={title ?? t('admin.roles.create.title')}
      description={description}
      preferences={preferences}
    >
      <form className={styles['form']} onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert variant="error" role="alert">
            {error}
          </Alert>
        )}
        <TextField
          name="name"
          label={t('admin.roles.create.fields.name')}
          required
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setName(event.target.value)}
        />
        <TextField
          name="description"
          label={t('admin.roles.create.fields.description')}
          value={roleDescription}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setRoleDescription(event.target.value)}
        />
        <div className={styles['formActions']}>
          {onCancel && (
            <Button type="button" variant="text" onClick={onCancel} disabled={isSubmitting}>
              {t('admin.common.actions.cancel')}
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} disabled={!name.trim() || isSubmitting}>
            {t('admin.roles.create.submit')}
          </Button>
        </div>
      </form>
    </AdminSection>
  );
};

export default BaseRoleCreate;
