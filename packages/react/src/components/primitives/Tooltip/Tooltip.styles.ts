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

import {css, keyframes} from '@emotion/css';
import {Theme} from '@thunderid/browser';
import {useMemo} from 'react';

const useStyles = (theme: Theme, colorScheme: string): Record<string, string> =>
  useMemo(() => {
    const fadeInAnimation = keyframes`
     from { opacity: 0; }
     to { opacity: 1; }
    `;

    const containerStyles: string = css`
      position: relative;
      display: inline-block;
    `;

    //   white-space: nowrap;
    const boxStyles: string = css`
      position: absolute;
      background-color: #333;
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      z-index: 1000;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
      animation: ${fadeInAnimation} 0.15s ease-in-out;

      min-width: 250px;
      white-space: normal;
      word-break: break-word;
      overflow-wrap: break-word;
      text-align: start;
    `;

    const topStyles: string = css`
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
    `;

    const bottomStyles: string = css`
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
    `;

    const leftStyles: string = css`
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 8px;
    `;

    const rightStyles: string = css`
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 8px;
    `;

    const arrowStyles: string = css`
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
    `;

    const topArrowStyles: string = css`
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 5px 5px 0 5px;
      border-color: #333 transparent transparent transparent;
    `;

    const bottomArrowStyles: string = css`
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 0 5px 5px 5px;
      border-color: transparent transparent #333 transparent;
    `;

    const leftArrowStyles: string = css`
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-width: 5px 0 5px 5px;
      border-color: transparent transparent transparent #333;
    `;

    const rightArrowStyles: string = css`
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-width: 5px 5px 5px 0;
      border-color: transparent #333 transparent transparent;
    `;

    return {
      container: containerStyles,
      box: boxStyles,
      top: topStyles,
      bottom: bottomStyles,
      left: leftStyles,
      right: rightStyles,
      arrow: arrowStyles,
      'top-arrow': topArrowStyles,
      'bottom-arrow': bottomArrowStyles,
      'left-arrow': leftArrowStyles,
      'right-arrow': rightArrowStyles,
    };
  }, [theme, colorScheme]);

export default useStyles;
