import { create } from 'zustand';
import { UserPermission, TemplateSettings } from '../types';

interface ConfigState {
  users: UserPermission[];
  templateSettings: TemplateSettings | null;
  
  setConfigData: (data: Partial<ConfigState>) => void;
  setUsers: (update: UserPermission[] | ((prev: UserPermission[]) => UserPermission[])) => void;
  setTemplateSettings: (settings: TemplateSettings) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  users: [],
  templateSettings: null,

  setConfigData: (data) => set(state => ({ ...state, ...data })),
  setUsers: (update) => set(state => ({ users: typeof update === 'function' ? (update as any)(state.users) : update })),
  setTemplateSettings: (update) => set(state => ({ templateSettings: typeof update === 'function' ? (update as any)(state.templateSettings) : update })),
}));
