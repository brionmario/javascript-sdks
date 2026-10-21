// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {mount} from '@vue/test-utils';
import {afterEach, describe, expect, it, vi} from 'vitest';
import {h} from 'vue';
import BaseGroupCreate from '../../components/presentation/admin/GroupCreate/BaseGroupCreate';
import GroupList from '../../components/presentation/admin/GroupList/GroupList';
import BaseGroupMembers from '../../components/presentation/admin/GroupMembers/BaseGroupMembers';
import RoleCreate from '../../components/presentation/admin/RoleCreate/RoleCreate';
import BaseUserDetails from '../../components/presentation/admin/UserDetails/BaseUserDetails';
import UserDetails from '../../components/presentation/admin/UserDetails/UserDetails';
import BaseUserList from '../../components/presentation/admin/UserList/BaseUserList';
import {createManagementContext, jsonResponse, translate} from '../helpers/managementContext';
import {chooseOption, findAllSelectControls} from '../helpers/selectControl';

const mounted: {unmount: () => void}[] = [];

const mountWith = (
  component: unknown,
  props: Record<string, unknown> = {},
  context = createManagementContext(),
  slots = {},
) => {
  const wrapper = mount(component as never, {
    attachTo: document.body,
    global: {provide: context.provide},
    props,
    slots,
  });
  mounted.push(wrapper);

  return {context, wrapper};
};

const users = [
  {attributes: {given_name: 'Jane', family_name: 'Doe'}, id: 'u1', ouHandle: 'default', ouId: 'ou-1', type: 'person'},
  {display: 'John Roe', id: 'u2', ouId: 'ou-1', type: 'person'},
];

describe('admin components (vue)', () => {
  afterEach(() => {
    mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  });

  describe('BaseUserList', () => {
    it('renders a captioned table with translated headers and a row per user', () => {
      const {wrapper} = mountWith(BaseUserList, {users});

      expect(wrapper.find('h2').text()).toBe(translate('admin.users.list.title'));
      expect(wrapper.find('caption').text()).toBe(translate('admin.users.list.title'));
      expect(wrapper.findAll('th').map((th) => th.text())).toEqual([
        translate('admin.users.list.columns.name'),
        translate('admin.users.list.columns.type'),
        translate('admin.common.columns.organization_unit'),
      ]);
      expect(wrapper.findAll('th').every((th) => th.attributes('scope') === 'col')).toBe(true);
      const rows = wrapper.findAll('tbody tr');
      expect(rows).toHaveLength(2);
      expect(rows[0].text()).toContain('Jane Doe');
      expect(rows[0].text()).toContain('default');
      expect(rows[1].text()).toContain('John Roe');
    });

    it('makes rows keyboard selectable buttons only when onSelect is set', async () => {
      const onSelect = vi.fn();
      const {wrapper} = mountWith(BaseUserList, {onSelect, selectedUserId: 'u2', users});

      const buttons = wrapper.findAll('tbody button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0].attributes('aria-pressed')).toBe('false');
      expect(buttons[1].attributes('aria-pressed')).toBe('true');

      await buttons[0].trigger('click');
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({id: 'u1'}));

      const {wrapper: readOnly} = mountWith(BaseUserList, {users});
      expect(readOnly.findAll('tbody button')).toHaveLength(0);
    });

    it('paginates and renders the actions slot, empty and error states', async () => {
      const onPageChange = vi.fn();
      const {wrapper} = mountWith(
        BaseUserList,
        {error: 'Boom', limit: 2, offset: 0, onPageChange, totalResults: 5, users},
        undefined,
        {actions: () => h('button', {class: 'add-user'}, 'Add')},
      );

      expect(wrapper.find('.add-user').exists()).toBe(true);
      expect(wrapper.find('[role="alert"]').text()).toBe('Boom');
      const nav = wrapper.find('nav');
      expect(nav.attributes('aria-label')).toBe(translate('admin.common.pagination.label'));
      expect(nav.text()).toContain(translate('admin.common.pagination.range', {end: 2, start: 1, total: 5}));
      await nav.findAll('button')[1].trigger('click');
      expect(onPageChange).toHaveBeenCalledWith(2);

      const {wrapper: empty} = mountWith(BaseUserList, {users: []});
      expect(empty.find('tbody').text()).toBe(translate('admin.users.list.empty'));
    });

    it('applies component-level i18n bundle overrides', () => {
      const {wrapper} = mountWith(BaseUserList, {
        preferences: {i18n: {bundles: {'en-US': {translations: {'admin.users.list.title': 'People'}}}}},
        users,
      });

      expect(wrapper.find('h2').text()).toBe('People');
    });
  });

  describe('BaseGroupCreate', () => {
    it('labels its fields, gates submit on a name and emits the trimmed values', async () => {
      const onCancel = vi.fn();
      const {wrapper} = mountWith(BaseGroupCreate, {onCancel});

      const inputs = wrapper.findAll('input');
      const labels = wrapper.findAll('label');
      expect(labels.map((label) => label.text().replace(' *', ''))).toEqual([
        translate('admin.groups.create.fields.name'),
        translate('admin.groups.create.fields.description'),
      ]);
      labels.forEach((label, index) => expect(label.attributes('for')).toBe(inputs[index].attributes('id')));
      const submit = wrapper.find('button[type="submit"]');
      expect(submit.attributes('disabled')).toBeDefined();

      await inputs[0].setValue('  Ops  ');
      await inputs[1].setValue(' ');
      expect(submit.attributes('disabled')).toBeUndefined();
      await wrapper.find('form').trigger('submit');

      expect(wrapper.emitted('submit')).toEqual([[{description: undefined, name: 'Ops'}]]);

      await wrapper.find('button[type="button"]').trigger('click');
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('BaseGroupMembers', () => {
    it('adds a picked identity and removes a member with a labelled button', async () => {
      const onAdd = vi.fn();
      const onRemove = vi.fn();
      const {wrapper} = mountWith(BaseGroupMembers, {
        candidates: {
          agent: [{id: 'a1', label: 'Bot'}],
          user: [
            {id: 'u1', label: 'Jane Doe'},
            {id: 'u2', label: 'John Roe'},
          ],
        },
        members: [{display: 'Jane Doe', id: 'u1', type: 'user'}],
        onAdd,
        onRemove,
      });

      const [typeSelect, identitySelect] = findAllSelectControls(wrapper);
      // Current members are not offered again.
      expect(Array.from((identitySelect.element as HTMLSelectElement).options).map((o) => o.textContent)).toEqual([
        translate('admin.common.fields.identity_placeholder'),
        'John Roe',
      ]);
      await chooseOption(identitySelect, 'John Roe');
      await wrapper.find('form').trigger('submit');
      expect(onAdd).toHaveBeenCalledWith({id: 'u2', type: 'user'});

      await chooseOption(typeSelect, translate('admin.common.identity_types.agent'));
      expect(
        Array.from((findAllSelectControls(wrapper)[1].element as HTMLSelectElement).options).map((o) => o.textContent),
      ).toContain('Bot');

      const remove = wrapper.find(
        `button[aria-label="${translate('admin.groups.members.remove_label', {name: 'Jane Doe'})}"]`,
      );
      expect(remove.exists()).toBe(true);
      await remove.trigger('click');
      expect(onRemove).toHaveBeenCalledWith({display: 'Jane Doe', id: 'u1', type: 'user'});
    });
  });

  describe('BaseUserDetails', () => {
    it('asks for confirmation before deleting, and edits text attributes keeping the others', async () => {
      const onDelete = vi.fn();
      const onUpdate = vi.fn();
      const user = {
        attributes: {
          email: 'jane@example.com',
          family_name: 'Doe',
          given_name: 'Jane',
          password: 'secret',
          tags: ['a'],
        },
        id: 'u1',
        ouId: 'ou-1',
        type: 'person',
      };
      const {wrapper} = mountWith(BaseUserDetails, {
        groups: [{id: 'g1', name: 'Ops', ouId: 'ou-1'}],
        onDelete,
        onUpdate,
        user,
      });

      expect(wrapper.find('h2').text()).toBe('Jane Doe');
      expect(wrapper.text()).not.toContain('secret');
      expect(wrapper.find(`ul[aria-label="${translate('admin.users.details.groups')}"]`).text()).toContain('Ops');

      const deleteButton = wrapper
        .findAll('button')
        .find((b) => b.text() === translate('admin.users.details.delete.action'))!;
      await deleteButton.trigger('click');
      expect(onDelete).not.toHaveBeenCalled();
      const group = wrapper.find('[role="group"]');
      expect(group.attributes('aria-label')).toBe(translate('admin.users.details.delete.confirm', {name: 'Jane Doe'}));
      await group.findAll('button')[1].trigger('click');
      expect(onDelete).toHaveBeenCalledTimes(1);

      const editButton = wrapper
        .findAll('button')
        .find((b) => b.text() === translate('admin.users.details.edit.action'))!;
      await editButton.trigger('click');
      const emailInput = wrapper
        .findAll('input')
        .find((input) => (input.element as HTMLInputElement).value === 'jane@example.com')!;
      await emailInput.setValue('jane@new.example');
      await wrapper.find('form').trigger('submit');
      expect(onUpdate).toHaveBeenCalledWith({...user.attributes, email: 'jane@new.example'});
    });
  });

  describe('connected components', () => {
    it('GroupList fetches its page and shows a translated message instead of the server text on 403', async () => {
      const context = createManagementContext();
      context.fetcher.mockResolvedValue(jsonResponse({code: 'GRP-1', message: 'raw server detail'}, 403));
      const {wrapper} = mountWith(GroupList, {}, context);

      await vi.waitFor(() => expect(wrapper.find('[role="alert"]').exists()).toBe(true));
      expect(context.fetcher.mock.calls[0][0]).toMatch(/^https:\/\/thunder\.example\/groups\?/);
      expect(wrapper.find('[role="alert"]').text()).toBe(translate('admin.common.errors.forbidden'));
      expect(wrapper.text()).not.toContain('raw server detail');
    });

    it('UserDetails loads the user and their groups, and deletes through the API', async () => {
      const context = createManagementContext();
      context.fetcher.mockImplementation((url: string, init: RequestInit) => {
        if (init.method === 'DELETE') return Promise.resolve(jsonResponse(null, 204));
        if (url.includes('/groups')) {
          return Promise.resolve(
            jsonResponse({count: 1, groups: [{id: 'g1', name: 'Ops', ouId: 'ou-1'}], startIndex: 1, totalResults: 1}),
          );
        }

        return Promise.resolve(jsonResponse(users[1]));
      });
      const {wrapper} = mountWith(UserDetails, {deletable: true, userId: 'u2'}, context);

      await vi.waitFor(() => expect(wrapper.find('h2').text()).toBe('John Roe'));
      await vi.waitFor(() => expect(wrapper.text()).toContain('Ops'));
      expect(context.fetcher.mock.calls.map((call) => call[0])).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^https:\/\/thunder\.example\/users\/u2(\?|$)/),
          expect.stringMatching(/\/users\/u2\/groups\?/),
        ]),
      );

      await wrapper
        .findAll('button')
        .find((b) => b.text() === translate('admin.users.details.delete.action'))!
        .trigger('click');
      await wrapper.find('[role="group"]').findAll('button')[1].trigger('click');

      await vi.waitFor(() => expect(wrapper.emitted('deleted')).toHaveLength(1));
      const deleteCall = context.fetcher.mock.calls.find((call) => call[1].method === 'DELETE')!;
      expect(deleteCall[0]).toBe('https://thunder.example/users/u2');
    });

    it("RoleCreate creates the role in the signed-in user's organization unit and emits created", async () => {
      const context = createManagementContext();
      context.fetcher.mockResolvedValue(jsonResponse({id: 'r1', name: 'Auditor', ouId: 'ou-1', permissions: []}, 201));
      const {wrapper} = mountWith(RoleCreate, {}, context);

      await wrapper.findAll('input')[0].setValue('Auditor');
      await wrapper.find('form').trigger('submit');

      await vi.waitFor(() => expect(wrapper.emitted('created')).toHaveLength(1));
      expect(context.fetcher.mock.calls[0][0]).toBe('https://thunder.example/roles');
      expect(JSON.parse(context.fetcher.mock.calls[0][1].body as string)).toEqual({name: 'Auditor', ouId: 'ou-1'});
      expect(wrapper.emitted('created')![0][0]).toMatchObject({id: 'r1'});
    });
  });
});
