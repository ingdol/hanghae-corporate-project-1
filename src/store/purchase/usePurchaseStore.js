import { create } from "zustand";

const usePurchaseStore = create((set) => ({
  isLoading: false,
  error: null,

  // purchase 시작
  purchaseStart: () => set({ isLoading: true, error: null }),

  // purchase 성공
  purchaseSuccess: () => set({ isLoading: false, error: null }),

  // purchase 실패
  purchaseFailure: (error) => set({ isLoading: false, error }),
}));

export default usePurchaseStore;
