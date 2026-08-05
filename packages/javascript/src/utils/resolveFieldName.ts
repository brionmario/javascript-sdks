// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import ThunderIDRuntimeError from '../errors/ThunderIDRuntimeError';

const resolveFieldName = (field: any): string => {
  if (field.param) {
    return field.param;
  }

  throw new ThunderIDRuntimeError(
    'Field name is not supported: ',
    'resolveFieldName-Invalid-001',
    'javascript',
    'The provided field name is not supported. Please check the field configuration.',
  );
};

export default resolveFieldName;
