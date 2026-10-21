// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {toManagementErrorMessage} from '@thunderid/browser';
import type {Preferences} from '@thunderid/browser';
import {
  type Component,
  type ComponentObjectPropsOptions,
  type PropType,
  type Ref,
  type SetupContext,
  type VNode,
  defineComponent,
  h,
  ref,
} from 'vue';
import useAdminTranslation, {type AdminTranslate} from './useAdminTranslation';
import type {ResourceQueryResult} from '../../../../composables/useResourceQuery';

/**
 * Describes a connected admin list (`UserList`, `GroupList`, ...).
 */
export interface ConnectedAdminListDefinition<TData, TRow> {
  /** The presentational list it renders. */
  base: Component;
  /** Translation key of the message shown when the page cannot be fetched. */
  errorKey: string;
  /** Extra props the list accepts and passes to `query` (for example `filter`). */
  extraProps?: ComponentObjectPropsOptions;
  /** Component name. */
  name: string;
  /** Fetches a page. `params` is a getter so the page refetches when it changes. */
  query: (params: () => Record<string, unknown>) => ResourceQueryResult<TData>;
  /** Extracts the rows from a page. */
  rows: (data: TData | undefined) => TRow[];
  /** Name of the base list's rows prop. */
  rowsProp: string;
  /** Name of the selected row prop. */
  selectedProp: string;
  /** Extracts the total from a page. */
  total: (data: TData | undefined) => number | undefined;
}

/**
 * Creates a list that fetches its own pages through a management composable and renders the given
 * presentational list. Server errors are mapped to translated messages; raw server text is never shown.
 *
 * @param definition - What the list fetches and renders.
 * @returns The component.
 */
const createConnectedAdminList = <TData, TRow>(definition: ConnectedAdminListDefinition<TData, TRow>): Component =>
  defineComponent({
    name: definition.name,
    props: {
      /** Extra CSS class added to the root element. */
      className: {default: '', type: String},
      /** Text shown under the title. */
      description: {default: undefined, type: String},
      /** Page size. */
      limit: {default: 20, type: Number},
      /** Called when a row is chosen. Rows are selectable only when set. Also available as `@select`. */
      onSelect: {default: undefined, type: Function as PropType<(row: TRow) => void>},
      /** Component-level preferences, for example `i18n.bundles` overrides. */
      preferences: {default: undefined, type: Object as PropType<Preferences>},
      /** Heading of the list. Pass an empty string to hide it. */
      title: {default: undefined, type: String},
      [definition.selectedProp]: {default: undefined, type: String},
      ...(definition.extraProps ?? {}),
    },
    setup(props: Record<string, unknown>, {slots}: SetupContext): () => VNode {
      const t: AdminTranslate = useAdminTranslation(() => props['preferences'] as Preferences | undefined);
      const offset: Ref<number> = ref(0);
      const extraKeys: string[] = Object.keys(definition.extraProps ?? {});
      const query: ResourceQueryResult<TData> = definition.query(() => ({
        ...Object.fromEntries(extraKeys.map((key: string) => [key, props[key]])),
        limit: props['limit'] as number,
        offset: offset.value,
      }));

      return (): VNode =>
        h(
          definition.base,
          {
            className: props['className'],
            description: props['description'],
            error: toManagementErrorMessage(t, query.error.value, definition.errorKey),
            isLoading: query.isLoading.value,
            limit: props['limit'],
            offset: offset.value,
            onPageChange: (next: number): void => {
              offset.value = next;
            },
            onSelect: props['onSelect'],
            preferences: props['preferences'],
            [definition.rowsProp]: definition.rows(query.data.value),
            [definition.selectedProp]: props[definition.selectedProp],
            title: props['title'],
            totalResults: definition.total(query.data.value),
          },
          slots['actions'] ? {actions: slots['actions']} : undefined,
        );
    },
  });

export default createConnectedAdminList;
