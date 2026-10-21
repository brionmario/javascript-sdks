// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Preferences, SelectOption} from '@thunderid/browser';
import {ChangeEvent, FC, FormEvent, ReactElement, useState} from 'react';
import useTheme from '../../../../contexts/Theme/useTheme';
import useTranslation from '../../../../hooks/useTranslation';
import Alert from '../../../primitives/Alert/Alert';
import Button from '../../../primitives/Button/Button';
import Select from '../../../primitives/Select/Select';
import TextField from '../../../primitives/TextField/TextField';
import AdminSection from '../shared/AdminSection';
import useStyles from '../shared/AdminSection.styles';

/**
 * The agent {@link BaseAgentCreate} submits. The organization unit is added by the caller.
 */
export interface AgentCreateSubmission {
  description?: string;
  name: string;
  type: string;
}

export interface BaseAgentCreateProps {
  /**
   * The agent types to choose from. The first one is selected by default.
   */
  agentTypes: SelectOption[];
  className?: string;
  description?: string;
  error?: string | null;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onSubmit: (agent: AgentCreateSubmission) => void;
  preferences?: Preferences;
  title?: string;
}

/**
 * A form that collects a new agent's name, type and description. Holds no data of its own: pass
 * the agent types and handle the submission.
 */
const BaseAgentCreate: FC<BaseAgentCreateProps> = ({
  agentTypes,
  className,
  description,
  error = null,
  isSubmitting = false,
  onCancel,
  onSubmit,
  preferences,
  title,
}: BaseAgentCreateProps): ReactElement => {
  const {theme, colorScheme} = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme);
  const {t} = useTranslation(preferences?.i18n);
  const [name, setName] = useState<string>('');
  const [chosenType, setType] = useState<string>('');
  const type: string = chosenType || (agentTypes[0]?.value ?? '');
  const [agentDescription, setAgentDescription] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit({description: agentDescription.trim() || undefined, name: name.trim(), type});
  };

  return (
    <AdminSection
      block="agent-create"
      className={className}
      title={title ?? t('admin.agents.create.title')}
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
          label={t('admin.agents.create.fields.name')}
          required
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setName(event.target.value)}
        />
        <Select
          label={t('admin.agents.create.fields.type')}
          name="type"
          required
          value={type}
          options={agentTypes}
          onChange={(event: ChangeEvent<HTMLSelectElement>): void => setType(event.target.value)}
        />
        <TextField
          name="description"
          label={t('admin.agents.create.fields.description')}
          value={agentDescription}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => setAgentDescription(event.target.value)}
        />
        <div className={styles['formActions']}>
          {onCancel && (
            <Button type="button" variant="text" onClick={onCancel} disabled={isSubmitting}>
              {t('admin.common.actions.cancel')}
            </Button>
          )}
          <Button type="submit" loading={isSubmitting} disabled={!name.trim() || !type || isSubmitting}>
            {t('admin.agents.create.submit')}
          </Button>
        </div>
      </form>
    </AdminSection>
  );
};

export default BaseAgentCreate;
