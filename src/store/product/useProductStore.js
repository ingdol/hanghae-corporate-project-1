import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [],
  hasNextPage: true,
  isLoading: false,
  error: null,
  totalCount: 0,
  setProducts: (products) => set({ products }),
  setHasNextPage: (hasNextPage) => set({ hasNextPage }),
  setTotalCount: (totalCount) => set({ totalCount }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export default useProductStore;
