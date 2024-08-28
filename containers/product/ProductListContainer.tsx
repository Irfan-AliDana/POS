"use client";

import { useEffect, useState } from "react";

export default function ProductListContainer() {
    const [data, setData] = useState([
        {
            name: "Jeans",
            price: "1000",
        },
        {
            name: "Jeans2",
            price: "1000",
        },
        {
            name: "Jeans3",
            price: "1000",
        },
        {
            name: "Jeans4",
            price: "1000",
        },
        {
            name: "Jeans5",
            price: "1000",
        },
    ]);
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
            const items = await fetch("/api/list-categories");
            console.log(items);
        };

        fetchItems();
    }, []);

    useEffect(() => {
        setData(data);
    }, [data]);

    return { data, cart, handleAddToCart, handleRemoveFromCart };
}
