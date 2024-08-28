"use client";

import ProductList from "@/components/layouts/ProductList";
import { useEffect, useState } from "react";

export type ItemType = {
    id: string;
    name: string;
    price: number;
    imageId: string;
    imageUrl: string;
};

export default function ProductListContainer() {
    const [data, setData] = useState<ItemType[]>([]);
    const [cart, setCart] = useState({});

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

    useEffect(() => {
        const fetchItems = async () => {
            const res = await fetch("/api/list-categories");

            if (!res.ok) {
                throw new Error("Something went wrong!");
            }

            const { itemsData } = await res.json();

            let updatedItem: ItemType[] = itemsData.objects
                .filter((item: any) => item.type === "ITEM")
                .map((item: any) => {
                    return {
                        id: item.id,
                        name: item.item_data.name,
                        price:
                            item.item_data.variations[0].item_variation_data
                                .price_money.amount / 100,
                        imageId: item.item_data?.image_ids?.[0],
                    };
                });

            const imagesIds = updatedItem
                .map((item: ItemType) => item.imageId)
                .filter((imageId) => imageId !== undefined);

            const itemRes = await fetch("/api/list-categories", {
                method: "POST",
                body: JSON.stringify({
                    image_ids: imagesIds,
                }),
            });

            if (!itemRes.ok) {
                throw new Error("Something went wrong");
            }

            const { itemsImagesData } = await itemRes.json();

            updatedItem = updatedItem.map((item) => {
                const image = itemsImagesData.objects.find(
                    (img: any) => img.id === item.imageId
                );

                return {
                    ...item,
                    imageUrl: image?.image_data.url,
                };
            });

            setData(updatedItem);
        };

        fetchItems();
    }, []);

    return (
        <ProductList
            data={data}
            cart={cart}
            handleAddToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
        />
    );
}
