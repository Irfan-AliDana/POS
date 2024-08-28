"use client";

import Product from "../composite/Product";
import { Flex } from "antd";
import ProductListContainer from "@/containers/product/ProductListContainer";

export default function ProductList() {
    const { data, cart, handleAddToCart, handleRemoveFromCart } =
        ProductListContainer();

    return (
        <Flex justify="center" wrap>
            {data.map((item) => (
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
