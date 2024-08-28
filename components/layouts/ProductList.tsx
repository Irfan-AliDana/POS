"use client";

import { ItemType } from "@/containers/product/ProductListContainer";
import Product from "../composite/Product";
import { Flex } from "antd";

type ProductProps = {
    data: ItemType[];
    handleAddToCart: (productId: string) => void;
    handleRemoveFromCart: (productId: string) => void;
    cart: { [key: string]: string };
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
