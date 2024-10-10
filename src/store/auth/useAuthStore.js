import { create } from "zustand";
import { getItem, setItem } from "@/helpers/localStorage";

const useAuthStore = create((set) => ({
  isLogin: getItem("isLogin") === "true",
  user: null,
  registerStatus: "idle",
  registerError: null,

  setIsLogin: (isLogin) => {
    setItem("isLogin", isLogin);
    set({ isLogin });
  },
  setUser: (user) => set({ user, isLogin: true }),
  logout: () => {
    setItem("isLogin", false);
    set({ isLogin: false, user: null });
  },
}));

export default useAuthStore;
