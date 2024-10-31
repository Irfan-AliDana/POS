"use client";

import Spinner from "@/src/components/base/Spinner";
import ProductList from "@/src/components/layouts/ProductList";
import { useSession } from "@/src/hooks/useSession";
import { BASE_URL_API } from "@/src/utils/constants";
import { fetcher } from "@/src/utils/lib";
import { useCartStore } from "@/src/zustand/store/cart-store";
import { Flex, Skeleton } from "antd";
import { createStyles } from "antd-style";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import _ from "underscore";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        padding: ${token.margin}px;
        max-width: 70%;
        margin-left: auto;
        margin-right: auto;
        position: relative;
    `,
    skeletonFlex: css`
        margin: 15px 20px;
        width: 250px;
    `,
}));

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

type Variation = {
    variationId: string;
    variant: string;
    price: Price;
};

type Price = {
    amount: number;
    currency: string;
};

export type Item = {
    catalogObjectId: string;
    name: string;
    variations: Variation[];
    imageUrl: string;
    incrementable: boolean;
};

export type Items = {
    cursor?: string;
    items: Item[];
};

export type CartItem = {
    quantity: number;
    data: Item;
};

export type Cart = {
    [key: string]: CartItem;
};

export type Data = {
    pages: Items[];
};

export default function ProductListContainer({
    initialProducts,
}: {
    initialProducts: Items;
}) {
    const { styles } = useStyles();

    const cart = useCartStore((state) => state.cart);
    const handleAddToCart = useCartStore((state) => state.addToCart);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");

    const { ref, inView } = useInView();

    const { session, sessionIsFetched } = useSession();

    const search = useCallback(
        _.debounce((value: string) => setDebouncedSearch(value), 500),
        []
    );

    if (debouncedSearch === "error") {
        throw new Error("App Crashed");
    }

    const { data: productCat, error: productCatError } = useSWR(
        sessionIsFetched ? `${BASE_URL_API}/api/list-categories` : null,
        (key) => fetcher(key, session?.token)
    );

    const transformedCat = productCat?.result.map(
        (cat: { id: string; name: string }) => ({
            label: cat.name,
            value: cat.id,
        })
    );

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (!sessionIsFetched) {
            return null;
        }
        if (previousPageData?.cursor === "") {
            return null;
        }
        const cursor = previousPageData?.cursor || "";
        return `${BASE_URL_API}/api/search-catalog-items?categoryId=${category}&textFilter=${debouncedSearch}&cursor=${cursor}`;
    };

    const {
        data: searchedProductData,
        error: searchError,
        size,
        setSize,
        isLoading,
        isValidating,
        // mutate,
    } = useSWRInfinite(
        getKey,
        (url) => fetcher(url, session?.token).then((data) => data.result),
        {
            revalidateFirstPage: false,
            initialSize: 1,
            fallbackData: [initialProducts],
            revalidateOnMount: false,
        }
    );

    const isSearchingOrFiltering = category || debouncedSearch !== "";
    const isFetchingNextPage = inView && isValidating;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        search(e.target.value);
    };

    const handleDropdown = (value: string | number) => {
        setCategory((value as string) || "");
    };

    useEffect(() => {
        if (inView && !isLoading) {
            setSize(size + 1);
        }
    }, [isLoading, inView]);

    // useEffect(() => {
    //     if (category || debouncedSearch) {
    //         mutate([], false); // Clear previous data without revalidation
    //     }
    // }, [category, debouncedSearch, mutate]);

    if (productCatError || searchError) {
        throw new Error(productCatError?.message);
    }

    return (
        <div style={{ position: "relative" }}>
            {isSearchingOrFiltering && !isFetchingNextPage && isValidating && (
                <div
                    style={{
                        zIndex: "10000",
                        position: "absolute",
                        left: "50%",
                        top: "40%",
                        height: "100vh - 158px",
                    }}
                >
                    <Spinner />
                </div>
            )}
            <Flex justify="center" vertical className={styles.container}>
                <ProductList
                    data={searchedProductData}
                    cart={cart}
                    handleAddToCart={handleAddToCart}
                    value={searchQuery}
                    handleSearch={handleSearch}
                    loading={isLoading}
                    options={transformedCat}
                    handleDropdown={handleDropdown}
                    // validating={isValidating}
                />
                <div ref={ref} style={{ padding: "10px 0" }}>
                    {isFetchingNextPage && (
                        <Flex justify="center" wrap>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ProductCardSkeleton key={index} />
                            ))}
                        </Flex>
                    )}
                </div>
            </Flex>
        </div>
    );
}
