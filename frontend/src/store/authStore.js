import { create } from 'zustand';

// Access token lives here only (memory) — never localStorage. The refresh
// token is an httpOnly cookie the browser sends automatically; this store
// never sees its value.
export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  status: 'idle', // 'idle' | 'authenticating' | 'ready'

  setAuth: (accessToken, user) => set({ accessToken, user, status: 'ready' }),
  setStatus: (status) => set({ status }),
  clear: () => set({ accessToken: null, user: null, status: 'ready' }),
}));
