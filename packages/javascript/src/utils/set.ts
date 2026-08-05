// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Sets the value at path of object. If a portion of path doesn't exist,
 * it's created. Arrays are created for missing index properties while
 * objects are created for all other missing properties.
 * Similar to Lodash's set() function
 *
 * @param object - The object to modify
 * @param path - The path of the property to set
 * @param value - The value to set
 * @returns The object
 */
const set = (object: any, path: string | string[], value: any): any => {
  if (!object || !path) return object;

  const pathArray: string[] = Array.isArray(path) ? path : path.split('.');
  const lastIndex: number = pathArray.length - 1;

  pathArray.reduce((current: any, key: string, index: number) => {
    if (index === lastIndex) {
      current[key] = value;
    } else if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      // Create array if next key is numeric, otherwise create object
      const nextKey: string = pathArray[index + 1];

      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    return current[key];
  }, object);

  return object;
};

export default set;
