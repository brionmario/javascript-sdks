// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {DataTableColumn} from '../../../primitives/DataTable/DataTable';

/**
 * What an admin list hands its `children` render function, so the rows can be shown with any UI,
 * such as a third-party data grid.
 */
export interface AdminListRenderProps<T> {
  /**
   * The columns the default table shows, with translated headers and cell renderers, to reuse in a
   * custom table.
   */
  columns: DataTableColumn<T>[];
  error: string | null;
  isLoading: boolean;
  limit: number;
  offset: number;
  /**
   * Shows the page that starts at `offset`. Undefined when the list is not paginated.
   */
  onPageChange?: (offset: number) => void;
  /**
   * Chooses a row. Undefined when rows are not selectable.
   */
  onSelect?: (row: T) => void;
  rows: T[];
  selectedRowId?: string;
  /**
   * Total number of rows on the server, or the number of rows given when unknown.
   */
  totalResults: number;
}
