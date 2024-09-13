import { Cart, Item } from "@/src/containers/product/ProductListContainer";
import { create } from "zustand";

type CartStore = {
    cart: Cart;
    addToCart: (productId: string, data: Item) => void;
    removeFromCart: (productId: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
    cart: {},
    addToCart: (productId, data) => {
        set((state) => {
            return {
                cart: {
                    ...state.cart,
                    [productId]: {
                        quantity: (state.cart[productId]?.quantity || 0) + 1,
                        data,
                    },
                },
            };
        });
    },
    removeFromCart: (productId) => {
        set((state) => {
            const updatedCart = { ...state.cart };
            if (updatedCart[productId].quantity > 1) {
                updatedCart[productId].quantity -= 1;
            } else {
                delete updatedCart[productId];
            }
            return { cart: updatedCart };
        });
    },
}));
