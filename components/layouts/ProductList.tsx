"use client";

import { Cart, Item } from "@/containers/product/ProductListContainer";
import Product from "../composite/Product";
import { Flex } from "antd";

type ProductProps = {
    data: Item[];
    handleAddToCart: (productId: string) => void;
    handleRemoveFromCart: (productId: string) => void;
    cart: Cart;
};

export default function ProductList({
    data,
    cart,
    handleAddToCart,
    handleRemoveFromCart,
}: ProductProps) {
    return (
        <Flex justify="center" wrap>
            {data.length > 0 &&
                data.map((item) => (
                    <Product
                        item={item}
                        handleAddToCart={handleAddToCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                        cart={cart}
                    />
                ))}
        </Flex>
    );
}
