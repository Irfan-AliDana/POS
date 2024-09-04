"use client";

import { Cart, Items } from "@/containers/product/ProductListContainer";
import Product from "../composite/Product";
import { Flex } from "antd";
import SearchBar, { SearchBarProps } from "../composite/SearchBar";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        padding: ${token.margin}px;
    `,
}));

type ProductProps = SearchBarProps & {
    data: Items;
    handleAddToCart: (productId: string) => void;
    handleRemoveFromCart: (productId: string) => void;
    cart: Cart;
};

export default function ProductList({
    data,
    cart,
    handleAddToCart,
    handleRemoveFromCart,
    value,
    handleSearch,
    loading,
    handleDropdown,
    options,
}: ProductProps) {
    const { styles } = useStyles();

    return (
        <Flex justify="center" vertical className={styles.container}>
            <SearchBar
                value={value}
                handleSearch={handleSearch}
                loading={loading}
                handleDropdown={handleDropdown}
                options={options}
            />

            {loading ? (
                <div>Loading</div>
            ) : (
                <div>
                    {data.pages.map((page, index) => (
                        <Flex wrap key={index}>
                            {page.items.map((item) => (
                                <Product
                                    item={item}
                                    handleAddToCart={handleAddToCart}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    cart={cart}
                                />
                            ))}
                        </Flex>
                    ))}
                </div>
            )}
        </Flex>
    );
}
