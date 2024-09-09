import { Cart } from "@/containers/product/ProductListContainer";
import { create } from "zustand";

type CartStore = {
    cart: Cart;
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: {},
    addToCart: (productId) => {
        set((state) => ({
            cart: {
                ...state.cart,
                [productId]: (state.cart[productId] || 0) + 1,
            },
        }));
    },
    removeFromCart: (productId) => {
        set((state) => {
            const updatedCart = { ...state.cart };
            if (updatedCart[productId] > 1) {
                updatedCart[productId] -= 1;
            } else {
                delete updatedCart[productId];
            }
            return { cart: updatedCart };
        });
    },
}));
