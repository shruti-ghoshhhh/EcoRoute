import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('ecoUser')) || null,
  login: (userData) => {
    localStorage.setItem('ecoUser', JSON.stringify(userData));
    set({ user: userData });
  },
  logout: () => {
    localStorage.removeItem('ecoUser');
    set({ user: null });
  }
}));
