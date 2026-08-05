// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {EmbeddedFlowComponent} from '@thunderid/browser';

/**
 * Result of heading extraction from flow components
 */
export interface HeadingExtractionResult {
  heading: EmbeddedFlowComponent | null;
  subheading: EmbeddedFlowComponent | null;
}

/**
 * Complete result of authentication component heading extraction
 */
export interface AuthComponentHeadingsResult {
  componentsWithoutHeadings: EmbeddedFlowComponent[];
  headingComponents: HeadingExtractionResult;
  subtitle: string;
  title: string;
}

/**
 * Extracts heading and subheading components from authentication flow components
 * and provides resolved title/subtitle text with fallback logic.
 *
 * This utility helps maintain consistent heading extraction across authentication
 * components (SignIn, SignUp, etc.) by identifying heading components within the
 * flow structure and providing clean fallback behavior.
 *
 * @param components - Array of flow components to search
 * @param flowTitle - Title from flow context (highest priority)
 * @param flowSubtitle - Subtitle from flow context (highest priority)
 * @param defaultTitle - Default title fallback (lowest priority)
 * @param defaultSubtitle - Default subtitle fallback (lowest priority)
 * @returns Object with resolved title and subtitle text, plus filtered components
 *
 * @example
 * ```typescript
 * const result = getAuthComponentHeadings(
 *   components,
 *   flowTitle,
 *   flowSubtitle,
 *   t('signin.heading'),
 *   t('signin.subheading')
 * );
 *
 * // Use resolved titles
 * <Card.Title>{result.title}</Card.Title>
 * <Typography>{result.subtitle}</Typography>
 *
 * // Render filtered components (without headings)
 * renderComponents(result.componentsWithoutHeadings);
 * ```
 */
const getAuthComponentHeadings = (
  components: EmbeddedFlowComponent[],
  flowTitle?: string,
  flowSubtitle?: string,
  defaultTitle?: string,
  defaultSubtitle?: string,
): AuthComponentHeadingsResult => {
  let heading: EmbeddedFlowComponent | null = null;
  let subheading: EmbeddedFlowComponent | null = null;

  /**
   * Recursively search for heading components
   */
  const findHeadings = (comps: EmbeddedFlowComponent[]): void => {
    for (const component of comps) {
      if (component.type === 'TEXT' && component.variant?.startsWith('HEADING_')) {
        if (!heading) {
          heading = component;
        } else if (!subheading) {
          subheading = component;
          break; // We found both, no need to continue
        }
      }
      if (component.components && component.components.length > 0) {
        findHeadings(component.components);
        if (heading && subheading) break; // Early exit if both found
      }
    }
  };

  /**
   * Filter out heading components from the flow
   */
  const filterComponents = (comps: EmbeddedFlowComponent[]): EmbeddedFlowComponent[] => {
    let foundHeadings = 0;
    const maxHeadings = 2;

    const filter = (items: EmbeddedFlowComponent[]): EmbeddedFlowComponent[] =>
      items.reduce((acc: EmbeddedFlowComponent[], component: EmbeddedFlowComponent) => {
        if (foundHeadings < maxHeadings && component.type === 'TEXT' && component.variant?.startsWith('HEADING_')) {
          foundHeadings += 1;
          return acc;
        }

        if (component.components && component.components.length > 0) {
          const filteredNestedComponents: EmbeddedFlowComponent[] = filter(component.components);
          if (filteredNestedComponents.length > 0) {
            acc.push({
              ...component,
              components: filteredNestedComponents,
            });
          }
        } else {
          acc.push(component);
        }

        return acc;
      }, []);

    return filter(comps);
  };

  /**
   * Extract text content from a component
   */
  const getComponentText = (component: EmbeddedFlowComponent | null): string => {
    if (!component) return '';
    return component.label || '';
  };

  findHeadings(components);

  const headingText: string = getComponentText(heading);
  const subheadingText: string = getComponentText(subheading);

  const result: AuthComponentHeadingsResult = {
    componentsWithoutHeadings: filterComponents(components),
    headingComponents: {heading, subheading},
    subtitle: flowSubtitle || subheadingText || defaultSubtitle || '',
    title: flowTitle || headingText || defaultTitle || '',
  };

  return result;
};

export default getAuthComponentHeadings;
