import { create } from "zustand";

const useToastStore = create((set) => ({
  toast: {
    message: "",
    isVisible: false,
  },
  showToast: (message) => set({ toast: { message, isVisible: true } }),
  hideToast: () => set({ toast: { message: "", isVisible: false } }),
}));

export default useToastStore;
