// Copyright 2025-2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {EmbeddedFlowComponent} from '@thunderid/browser';
import {FC, ReactElement} from 'react';
import useStyles from './BaseDeviceGrant.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import CardPrimitive from '../../primitives/Card/Card';
import Typography from '../../primitives/Typography/Typography';
import BaseSignIn, {type BaseSignInProps} from '../SignIn/BaseSignIn';

export type DeviceGrantResult = 'failure' | 'success' | null;

export interface BaseDeviceGrantProps extends Omit<BaseSignInProps, 'components' | 'onSubmit'> {
  components: EmbeddedFlowComponent[];
  completeMessage?: string;
  completeDescription?: string;
  failedMessage?: string;
  failedDescription?: string;
  onSubmit: NonNullable<BaseSignInProps['onSubmit']>;
  result?: DeviceGrantResult;
}

/** Renders the server-described Device Grant prompt independently of SDK orchestration. */
const BaseDeviceGrant: FC<BaseDeviceGrantProps> = ({
  components,
  className = '',
  completeMessage = undefined,
  completeDescription = undefined,
  failedMessage = undefined,
  failedDescription = undefined,
  error,
  isLoading,
  preferences,
  result = null,
  variant = 'default',
  ...signInProps
}: BaseDeviceGrantProps): ReactElement => {
  const {theme} = useTheme();
  const {t} = useTranslation(preferences?.i18n);
  const styles = useStyles(theme);

  if ((error || result) && components.length === 0) {
    const isSuccess = result === 'success' && !error;
    const resolvedCompleteMessage = completeMessage ?? t('deviceGrant.messages.complete');
    const resolvedCompleteDescription = completeDescription ?? t('deviceGrant.messages.completeDescription');
    const resolvedFailedMessage = failedMessage ?? t('deviceGrant.messages.failed');
    const resolvedFailedDescription = failedDescription ?? t('deviceGrant.messages.failedDescription');
    const title = isSuccess ? resolvedCompleteMessage : resolvedFailedMessage;
    const description = isSuccess
      ? resolvedCompleteDescription
      : !error || error.message === resolvedFailedMessage
        ? resolvedFailedDescription
        : error.message;

    return (
      <CardPrimitive
        className={`${styles['terminalCard']} ${className}`}
        data-testid="device-grant-result"
        variant={variant}
      >
        <Typography
          className={styles['terminalTitle']}
          color={isSuccess ? 'success' : 'error'}
          component="h2"
          fontWeight={600}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography className={styles['terminalDescription']} color="textSecondary" component="p" variant="caption">
          {description}
        </Typography>
      </CardPrimitive>
    );
  }

  return (
    <BaseSignIn
      {...signInProps}
      className={className}
      key={components.map((component: EmbeddedFlowComponent) => component.id).join('|')}
      components={components}
      error={error}
      isLoading={isLoading}
      preferences={preferences}
    />
  );
};

export default BaseDeviceGrant;
