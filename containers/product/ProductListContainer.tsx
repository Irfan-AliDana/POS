"use client";

import Spinner from "@/components/base/Spinner";
import ProductList from "@/components/layouts/ProductList";
import { BASE_URL_API } from "@/utils/constants";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Flex } from "antd";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

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

export type Cart = {
    [key: string]: number;
};

export type Data = {
    pages: Items[];
};

export default function ProductListContainer() {
    const [cart, setCart] = useState<Cart>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);

    const { ref, inView } = useInView();

    const {
        data: productCat,
        error: productCatError,
        isLoading: productCatLoading,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: () =>
            fetch(`${BASE_URL_API}/api/list-categories`, {
                headers: {
                    Authorization:
                        "eyJhbGciOiJIUzI1NiJ9.TUxEODI1MjNWV0ZGUw.NvAa40shtB2LjY736chOJU6J9tm5JRyDd_XQHu8lxMY",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    const transformedData = data.result.map(
                        (cat: { id: string; name: string }) => ({
                            label: cat.name,
                            value: cat.id,
                        })
                    );
                    setCategories(transformedData);

                    return data.result;
                }),
    });

    const {
        data: searchedProductData,
        error: searchError,
        status,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["infiniteProducts", searchQuery, category],
        queryFn: ({ pageParam }: { pageParam: string }) =>
            fetch(
                `${BASE_URL_API}/api/search-catalog-items?categoryId=${category}&textFilter=${searchQuery}&cursor=${pageParam}`,
                {
                    headers: {
                        Authorization:
                            "eyJhbGciOiJIUzI1NiJ9.TUxEODI1MjNWV0ZGUw.NvAa40shtB2LjY736chOJU6J9tm5JRyDd_XQHu8lxMY",
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    return data.result;
                }),
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
            if (lastPage?.cursor !== "") {
                return lastPage.cursor;
            }
            return undefined;
        },
    });

    const handleAddToCart = (productId: string) => {
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: (prevCart[productId] || 0) + 1,
        }));
    };

    const handleRemoveFromCart = (productId: string) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            if (updatedCart[productId] > 1) {
                updatedCart[productId] -= 1;
                return updatedCart;
            } else {
                delete updatedCart[productId];
            }
            return updatedCart;
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDropdown = (value: string) => {
        setCategory(value || "");
    };

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [fetchNextPage, inView]);

    if (productCatError || searchError) {
        throw new Error(productCatError?.message);
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
                options={categories}
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
