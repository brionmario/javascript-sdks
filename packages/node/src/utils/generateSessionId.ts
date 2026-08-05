// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const generateSessionId = (): string => new Date().getTime().toString(36) + Math.random().toString(36).substring(2);

export default generateSessionId;
