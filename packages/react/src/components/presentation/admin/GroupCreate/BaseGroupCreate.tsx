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
 * The group {@link BaseGroupCreate} submits. The organization unit is added by the caller.
 */
export interface GroupCreateSubmission {
  description?: string;
  name: string;
}

export interface BaseGroupCreateProps {
  className?: string;
  description?: string;
  error?: string | null;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (group: GroupCreateSubmission) => void;
  preferences?: Preferences;
  title?: string;
}

/**
 * A form that collects a new group's name and description. Holds no data of its own: handle the
 * submission.
 */
const BaseGroupCreate: FC<BaseGroupCreateProps> = ({
  className,
  description,
  error = null,
  isSubmitting = false,
  onCancel,
  onSubmit,
  preferences,
  title,
}: BaseGroupCreateProps): ReactElement => {
  const {theme, colorScheme} = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme);
  const {t} = useTranslation(preferences?.i18n);
  const [name, setName] = useState<string>('');
  const [groupDescription, setGroupDescription] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit({description: groupDescription.trim() || undefined, name: name.trim()});
  };

  return (
    <AdminSection
      block="group-create"
      className={className}
      title={title ?? t('admin.groups.create.title')}
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
          label={t('admin.groups.create.fields.name')}
          required
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setName(event.target.value)}
        />
        <TextField
          name="description"
          label={t('admin.groups.create.fields.description')}
          value={groupDescription}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setGroupDescription(event.target.value)}
        />
        <div className={styles['formActions']}>
          {onCancel && (
            <Button type="button" variant="text" onClick={onCancel} disabled={isSubmitting}>
              {t('admin.common.actions.cancel')}
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} disabled={!name.trim() || isSubmitting}>
            {t('admin.groups.create.submit')}
          </Button>
        </div>
      </form>
    </AdminSection>
  );
};

export default BaseGroupCreate;
