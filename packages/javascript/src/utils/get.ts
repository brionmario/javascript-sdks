// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Gets the value at path of object. If the resolved value is undefined,
 * the defaultValue is returned in its place.
 * Similar to Lodash's get() function
 *
 * @param object - The object to query
 * @param path - The path of the property to get
 * @param defaultValue - The value returned for undefined resolved values
 * @returns The resolved value
 */
const get = (object: any, path: string | string[], defaultValue?: any): any => {
  if (!object || !path) return defaultValue;

  const pathArray: string[] = Array.isArray(path) ? path : path.split('.');

  const result: any = pathArray.reduce((current: any, key: string) => current?.[key], object);

  return result !== undefined ? result : defaultValue;
};

export default get;
