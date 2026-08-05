// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC, PropsWithChildren, ReactElement} from 'react';
import ComponentRendererContext, {ComponentRendererMap} from './ComponentRendererContext';

interface ComponentRendererProviderProps {
  renderers: ComponentRendererMap;
}

const ComponentRendererProvider: FC<PropsWithChildren<ComponentRendererProviderProps>> = ({
  renderers,
  children,
}: PropsWithChildren<ComponentRendererProviderProps>): ReactElement => (
  <ComponentRendererContext.Provider value={renderers}>{children}</ComponentRendererContext.Provider>
);

export default ComponentRendererProvider;
