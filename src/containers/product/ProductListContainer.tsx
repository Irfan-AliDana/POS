"use client";

import Spinner from "@/src/components/base/Spinner";
import ProductList from "@/src/components/layouts/ProductList";
import { useFetch } from "@/src/hooks/useFetch";
import { useSession } from "@/src/hooks/useSession";
import { BASE_URL_API } from "@/src/utils/constants";
import { useCartStore } from "@/src/zustand/store/cart-store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Flex } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import _ from "underscore";

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

export default function ProductListContainer() {
    const cart = useCartStore((state) => state.cart);
    const handleAddToCart = useCartStore((state) => state.addToCart);
    const handleRemoveFromCart = useCartStore((state) => state.removeFromCart);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");

    const router = useRouter();

    const { ref, inView } = useInView();

    const { session, sessionIsFetched } = useSession();

    const search = useCallback(
        _.debounce((value: string) => setDebouncedSearch(value), 500),
        []
    );

    if (debouncedSearch === "error") {
        throw new Error("App Crashed");
    }

    const { data: productCat, error: productCatError } = useQuery({
        queryKey: ["categories", sessionIsFetched],
        queryFn: () =>
            useFetch(`${BASE_URL_API}/api/list-categories`, {
                Authorization: session?.token,
            }),
        enabled: !!session?.token,
    });

    const transformedCat = productCat?.result.map(
        (cat: { id: string; name: string }) => ({
            label: cat.name,
            value: cat.id,
        })
    );

    const {
        data: searchedProductData,
        error: searchError,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: [
            "infiniteProducts",
            debouncedSearch,
            category,
            sessionIsFetched,
        ],
        queryFn: ({ pageParam }: { pageParam: string }) =>
            useFetch(
                `${BASE_URL_API}/api/search-catalog-items?categoryId=${category}&textFilter=${debouncedSearch}&cursor=${pageParam}`,
                {
                    Authorization: session?.token,
                }
            ).then((data) => data.result),
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            if (lastPage?.cursor !== "") {
                return lastPage.cursor;
            }
            return undefined;
        },
        enabled: !!session?.token,
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        search(e.target.value);
    };

    const handleDropdown = (value: string | number) => {
        setCategory((value as string) || "");
    };

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);

    if (productCatError || searchError) {
        throw new Error(productCatError?.message);
    }

    if (!session?.isLoggedIn) {
        return router.push("/login") as React.ReactNode;
    }

    return (
        <div>
            <ProductList
                data={searchedProductData}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                value={searchQuery}
                handleSearch={handleSearch}
                loading={isLoading}
                options={transformedCat}
                handleDropdown={handleDropdown}
            />
            <div ref={ref} style={{ padding: "10px 0" }}>
                {isFetchingNextPage && (
                    <Flex justify="center">
                        <Spinner size={30} />
                    </Flex>
                )}
            </div>
        </div>
    );
}
