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

  const findHeadings = (comps: EmbeddedFlowComponent[]): void => {
    comps.some((component: EmbeddedFlowComponent) => {
      if (component.type === 'TEXT' && component.variant?.startsWith('HEADING_')) {
        if (!heading) {
          heading = component;
        } else if (!subheading) {
          subheading = component;
          return true;
        }
      }

      if (component.components && component.components.length > 0) {
        findHeadings(component.components);
        return Boolean(heading && subheading);
      }

      return false;
    });
  };

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
