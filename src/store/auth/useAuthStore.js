import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLogin: false,
  user: null,
  registerStatus: "idle",
  registerError: null,

  setIsLogin: (isLogin) => set({ isLogin }),
  setUser: (user) => set({ user, isLogin: true }),
  logout: () => set({ isLogin: false, user: null }),
}));

export default useAuthStore;
