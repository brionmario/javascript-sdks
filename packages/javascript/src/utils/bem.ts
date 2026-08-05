// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Creates a BEM-style class name by combining a base class with element and/or modifier
 *
 * @param baseClass - The base CSS class string (usually from emotion's css function)
 * @param element - The BEM element name (optional)
 * @param modifier - The BEM modifier name (optional)
 * @returns The combined class name string
 *
 * @example
 * ```tsx
 * const baseClass = css`
 *   display: flex;
 *   &__element {
 *     color: red;
 *   }
 *   &--modifier {
 *     background: blue;
 *   }
 * `;
 *
 * import bem from './utils/bem';
 *
 * const elementClass = bem(baseClass, 'element');
 * const modifierClass = bem(baseClass, null, 'modifier');
 * const elementWithModifierClass = bem(baseClass, 'element', 'modifier');
 * ```
 */
const bem = (baseClass: string, element?: string | null, modifier?: string | null): string => {
  let className: string = baseClass;

  if (element) {
    className += `__${element}`;
  }

  if (modifier) {
    className += `--${modifier}`;
  }

  return className;
};

export default bem;
