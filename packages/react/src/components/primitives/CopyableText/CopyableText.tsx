// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FC, ReactElement, useCallback, useState} from 'react';
import useStyles from './CopyableText.styles';
import useTheme from '../../../contexts/Theme/useTheme';
import useTranslation from '../../../hooks/useTranslation';
import Button from '../Button/Button';

export interface CopyableTextProps {
  /**
   * Optional label displayed above the value box.
   */
  label?: string;
  /**
   * The text value to display and copy.
   */
  value: string;
}

/**
 * A React component that displays a text value with an optional label and a button to copy the value to
 * the clipboard. When the button is clicked, it attempts to copy the value using the Clipboard API, and
 * falls back to a textarea method if the API is not supported.
 * After copying, it shows a "Copied!" message for 3 seconds before resetting.
 */
const CopyableText: FC<CopyableTextProps> = ({label, value}: CopyableTextProps): ReactElement => {
  const {theme} = useTheme();
  const styles: Record<string, string> = useStyles(theme);
  const {t} = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy: ReturnType<typeof useCallback> = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textArea: HTMLTextAreaElement = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [value]);

  return (
    <div className={styles['container']}>
      {label && <span className={styles['label']}>{label}</span>}
      <div className={styles['valueBox']}>
        <span className={styles['valueText']}>{value}</span>
        <Button
          variant="outline"
          size="small"
          className={styles['copyButton']}
          onClick={() => {
            handleCopy().catch(() => undefined);
          }}
        >
          {copied ? t('elements.display.copyable_text.copied') : t('elements.display.copyable_text.copy')}
        </Button>
      </div>
    </div>
  );
};

export default CopyableText;
