import { create } from "zustand";
import {
  getCartFromLocalStorage,
  resetCartAtLocalStorage,
  setCartToLocalStorage,
  calculateTotal,
} from "./cartUtils";

// Zustand를 사용하여 장바구니 상태를 정의합니다.
const useCartStore = create((set, get) => ({
  cart: [],
  totalCount: 0,
  totalPrice: 0,

  // 장바구니 초기화
  initCart: (userId) => {
    if (!userId) return;
    const prevCartItems = getCartFromLocalStorage(userId);
    const total = calculateTotal(prevCartItems);
    set({
      cart: prevCartItems,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
  },

  // 장바구니 리셋
  resetCart: (userId) => {
    resetCartAtLocalStorage(userId);
    set({
      cart: [],
      totalCount: 0,
      totalPrice: 0,
    });
  },

  // 장바구니 아이템 추가
  addCartItem: (state) => {
    const { item, userId, count } = state;
    const cart = get().cart || [];
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    let updatedCart;
    if (existingItemIndex !== -1) {
      // 이미 장바구니에 있는 항목인 경우, 수량 업데이트
      updatedCart = cart.map((cartItem, index) =>
        index === existingItemIndex
          ? { ...cartItem, count: cartItem.count + count }
          : cartItem
      );
    } else {
      // 새로운 항목 추가
      updatedCart = [...cart, { ...item, count }];
    }

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
    setCartToLocalStorage(updatedCart, userId);
  },

  // 장바구니 아이템 제거
  removeCartItem: (state) => {
    const cart = get().cart || [];
    const { itemId, userId } = state;
    const updatedCart = cart.filter((item) => item.id !== itemId);

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
    setCartToLocalStorage(updatedCart, userId);
  },

  // 장바구니 아이템 수량 변경
  changeCartItemCount: (state) => {
    const cart = get().cart || [];
    const { itemId, count, userId } = state;
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, count } : item
    );

    const total = calculateTotal(updatedCart);
    set({
      cart: updatedCart,
      totalCount: total.totalCount,
      totalPrice: total.totalPrice,
    });
    setCartToLocalStorage(updatedCart, userId);
  },
}));

export default useCartStore;
