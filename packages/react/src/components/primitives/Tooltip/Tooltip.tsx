/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {cx} from '@emotion/css';
import {withVendorCSSClassPrefix, bem} from '@thunderid/browser';
import {FC, InputHTMLAttributes, ReactNode, useState} from 'react';
import useStyles from './Tooltip.styles';
import useTheme from '../../../contexts/Theme/useTheme';

/**
 * Props for the Tooltip component.
 */
export interface Tooltiprops extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'type'> {
  className?: string;
  helperText?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: ReactNode;
}

/**
 * A Tooltip component that convert any react or html element to a tooltip.
 * When a user hover on it, they will see a small tooltip with some info.
 *
 * It will take a children, which can be a react element or html element.
 *
 * @param props - Props for the Tooltip component
 * @returns A JSX element representing the Tooltip
 */
const Tooltip: FC<Tooltiprops> = ({className, helperText, style = {}, position, children, ...rest}: Tooltiprops) => {
  const {theme, colorScheme}: ReturnType<typeof useTheme> = useTheme();
  const styles: Record<string, string> = useStyles(theme, colorScheme);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div
      className={cx(withVendorCSSClassPrefix(bem('tooltip', 'container')), className, styles['container'])}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cx(
            withVendorCSSClassPrefix(bem('tooltip', 'box')),
            withVendorCSSClassPrefix(bem('tooltip', position)),
            styles['box'],
            styles[position || 'bottom'],
          )}
        >
          {helperText}
          <span
            className={cx(
              withVendorCSSClassPrefix(bem('tooltip', 'arrow')),
              styles['arrow'],
              styles[`${position}-arrow`],
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
