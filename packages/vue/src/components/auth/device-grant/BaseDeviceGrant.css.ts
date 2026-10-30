// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';

const BASE_DEVICE_GRANT_CSS = `
.${withVendorCSSClassPrefix('devicegrant__terminal')} {
  box-sizing: border-box;
  width: 100%;
  max-width: calc(var(--thunderid-spacing-unit) * 60);
  margin: 0 auto;
  gap: var(--thunderid-spacing-unit);
}

.${withVendorCSSClassPrefix('devicegrant__terminal-title')} {
  margin: 0;
}

.${withVendorCSSClassPrefix('devicegrant__terminal-title--success')} {
  color: var(--thunderid-color-success-main);
}

.${withVendorCSSClassPrefix('devicegrant__terminal-title--failure')} {
  color: var(--thunderid-color-error-main);
}

.${withVendorCSSClassPrefix('devicegrant__terminal-description')} {
  margin: 0;
}
`;

export default BASE_DEVICE_GRANT_CSS;
