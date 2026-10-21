// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {withVendorCSSClassPrefix} from '@thunderid/browser';
import {type VNode, type VNodeChild, h} from 'vue';
import type {AdminFormProps} from './adminFormProps';
import AdminSection from './AdminSection';
import type {AdminTranslate} from './useAdminTranslation';
import Alert from '../../../primitives/Alert/Alert';
import Button from '../../../primitives/Button/Button';

/**
 * Renders the frame of an admin create form: the section, the error, the fields and the cancel and
 * submit buttons.
 *
 * @param options - What to render.
 * @returns The form.
 */
const renderAdminForm = ({
  block,
  canSubmit,
  fields,
  onSubmit,
  props,
  submitLabel,
  t,
  title,
}: {
  block: string;
  canSubmit: boolean;
  fields: VNodeChild[];
  onSubmit: () => void;
  props: AdminFormProps;
  submitLabel: string;
  t: AdminTranslate;
  title: string;
}): VNode =>
  h(
    AdminSection,
    {block, className: props.className, description: props.description, title: props.title ?? title},
    {
      default: (): VNode =>
        h(
          'form',
          {
            class: withVendorCSSClassPrefix('admin__form'),
            novalidate: true,
            onSubmit: (event: Event): void => {
              event.preventDefault();

              if (canSubmit && !props.isSubmitting) {
                onSubmit();
              }
            },
          },
          [
            props.error ? h(Alert, {severity: 'error'}, {default: (): string[] => [props.error!]}) : null,
            ...fields,
            h('div', {class: withVendorCSSClassPrefix('admin__form-actions')}, [
              props.onCancel
                ? h(
                    Button,
                    {disabled: props.isSubmitting, onClick: props.onCancel, type: 'button', variant: 'text'},
                    {default: (): string => t('admin.common.actions.cancel')},
                  )
                : null,
              h(
                Button,
                {disabled: !canSubmit || props.isSubmitting, loading: props.isSubmitting, type: 'submit'},
                {default: (): string => submitLabel},
              ),
            ]),
          ],
        ),
    },
  );

export default renderAdminForm;
