// Copyright 2025 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Formats a date string to a human-readable format.
 *
 * @param dateString - The date string to format (optional)
 * @returns A formatted date string in 'Month Day, Year' format, or '-' if no date is provided, or the original string if parsing fails
 *
 * @example
 * ```typescript
 * formatDate('2025-07-09T10:30:00Z'); // Returns "July 9, 2025"
 * formatDate(''); // Returns "-"
 * formatDate(undefined); // Returns "-"
 * formatDate('invalid-date'); // Returns "invalid-date"
 * ```
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export default formatDate;
