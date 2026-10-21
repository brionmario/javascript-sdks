// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {type Component, type Ref, type SetupContext, type VNode, defineComponent, h, ref, useId} from 'vue';
import TextField from '../../../primitives/TextField/TextField';
import {type AdminFormProps, adminFormProps} from '../shared/adminFormProps';
import renderAdminForm from '../shared/renderAdminForm';
import useAdminTranslation, {type AdminTranslate} from '../shared/useAdminTranslation';

/**
 * The role `BaseRoleCreate` emits on `submit`. The organization unit is added by the caller.
 */
export interface RoleCreateSubmission {
  description?: string;
  name: string;
}

/**
 * A form that collects a new role's name and description. Holds no data of its own: handle the
 * `submit` event, which carries a {@link RoleCreateSubmission}.
 */
const BaseRoleCreate: Component = defineComponent({
  name: 'BaseRoleCreate',
  props: {
    ...adminFormProps,
  },
  emits: ['submit'],
  setup(props: AdminFormProps, {emit}: SetupContext): () => VNode {
    const t: AdminTranslate = useAdminTranslation(() => props.preferences);
    const uid: string = useId();
    const name: Ref<string> = ref('');
    const description: Ref<string> = ref('');

    return (): VNode => {
      return renderAdminForm({
        block: 'role-create',
        canSubmit: Boolean(name.value.trim()),
        fields: [
          h(TextField, {
            label: t('admin.roles.create.fields.name'),
            modelValue: name.value,
            name: `${uid}-name`,
            'onUpdate:modelValue': (value: string): void => {
              name.value = value;
            },
            required: true,
          }),
          h(TextField, {
            label: t('admin.roles.create.fields.description'),
            modelValue: description.value,
            name: `${uid}-description`,
            'onUpdate:modelValue': (value: string): void => {
              description.value = value;
            },
          }),
        ],
        onSubmit: (): void => {
          emit('submit', {
            description: description.value.trim() || undefined,
            name: name.value.trim(),
          } satisfies RoleCreateSubmission);
        },
        props,
        submitLabel: t('admin.roles.create.submit'),
        t,
        title: t('admin.roles.create.title'),
      });
    };
  },
});

export default BaseRoleCreate;
