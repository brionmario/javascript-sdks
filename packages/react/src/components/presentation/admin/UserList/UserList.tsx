// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {toManagementErrorMessage} from '@thunderid/browser';
import {FC, ReactElement, useState} from 'react';
import BaseUserList, {BaseUserListProps} from './BaseUserList';
import useGetUsers from '../../../../hooks/users/useGetUsers';
import useTranslation from '../../../../hooks/useTranslation';

export type UserListProps = Omit<
  BaseUserListProps,
  'error' | 'isLoading' | 'offset' | 'onPageChange' | 'totalResults' | 'users'
> & {
  /**
   * Server-side filter expression, for example `username sw "a"`.
   */
  filter?: string;
};

/**
 * Lists the users the signed-in user is allowed to see, a page at a time.
 *
 * @example
 * ```tsx
 * <UserList onSelect={(user) => setSelectedUserId(user.id)} />
 * ```
 */
const UserList: FC<UserListProps> = ({filter, limit = 20, preferences, ...rest}: UserListProps): ReactElement => {
  const {t} = useTranslation(preferences?.i18n);
  const [offset, setOffset] = useState<number>(0);
  const {data, error, isLoading} = useGetUsers({filter, limit, offset});

  return (
    <BaseUserList
      users={data?.users ?? []}
      totalResults={data?.totalResults}
      isLoading={isLoading}
      error={toManagementErrorMessage(t, error, 'admin.users.list.error')}
      limit={limit}
      offset={offset}
      onPageChange={setOffset}
      preferences={preferences}
      {...rest}
    />
  );
};

export default UserList;
