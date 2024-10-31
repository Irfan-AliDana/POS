"use client";

import {
    Cart,
    Item,
    Items,
} from "@/src/containers/product/ProductListContainer";
import Product from "../composite/Product";
import { Flex } from "antd";
import SearchBar, { SearchBarProps } from "../composite/SearchBar";
import { useRef } from "react";

type ProductProps = SearchBarProps & {
    data: any;
    handleAddToCart: (productId: string, data: Item) => void;
    cart: Cart;
    // validating: boolean;
};

export default function ProductList({
    data,
    cart,
    handleAddToCart,
    value,
    handleSearch,
    loading,
    handleDropdown,
    options,
}: // validating,
ProductProps) {
    return (
        <>
            <SearchBar
                value={value}
                handleSearch={handleSearch}
                loading={loading}
                handleDropdown={handleDropdown}
                options={options}
            />
            <div>
                {data?.length ? (
                    data.map((page: Items, index: number) => (
                        <Flex justify="center" wrap key={index}>
                            {page.items.map((item) => (
                                <Product
                                    item={item}
                                    handleAddToCart={handleAddToCart}
                                    cart={cart}
                                    key={item.catalogObjectId}
                                />
                            ))}
                        </Flex>
                    ))
                ) : (
                    <Flex
                        justify="center"
                        align="center"
                        style={{
                            height: "calc(100vh - 158px)",
                        }}
                    >
                        <h2>No Item Found</h2>
                    </Flex>
                )}
            </div>
        </>
    );
}
