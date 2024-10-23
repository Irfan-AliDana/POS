"use client";

import {
    Cart,
    Data,
    Item,
} from "@/src/containers/product/ProductListContainer";
import Product from "../composite/Product";
import { Flex, Skeleton } from "antd";
import SearchBar, { SearchBarProps } from "../composite/SearchBar";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        padding: ${token.margin}px;
        max-width: 70%;
        margin-left: auto;
        margin-right: auto;
    `,
    skeletonFlex: css`
        margin: 15px 20px;
        width: 250px;
    `,
}));

type ProductProps = SearchBarProps & {
    data: Data | undefined;
    handleAddToCart: (productId: string, data: Item) => void;
    handleRemoveFromCart: (productId: string) => void;
    cart: Cart;
};

const ProductCardSkeleton = () => {
    const { styles } = useStyles();

    return (
        <Flex
            vertical
            justify="center"
            gap={18}
            className={styles.skeletonFlex}
        >
            <Skeleton.Input style={{ width: "250px", height: 300 }} active />

            <Skeleton.Input style={{ width: "100%" }} active />

            <Flex justify="flex-end">
                <Skeleton.Input
                    active
                    style={{
                        width: "50%",
                    }}
                />
            </Flex>
        </Flex>
    );
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
                <Flex justify="center" wrap>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </Flex>
            ) : (
                <div>
                    {data &&
                        data.pages.map((page, index) => (
                            <Flex justify="center" wrap key={index}>
                                {page.items.map((item) => (
                                    <Product
                                        item={item}
                                        handleAddToCart={handleAddToCart}
                                        handleRemoveFromCart={
                                            handleRemoveFromCart
                                        }
                                        cart={cart}
                                        key={item.catalogObjectId}
                                    />
                                ))}
                            </Flex>
                        ))}
                </div>
            )}
        </Flex>
    );
}
