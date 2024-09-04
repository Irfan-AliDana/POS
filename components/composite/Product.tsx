"use client";

import { Flex } from "antd";
import Image from "next/image";
import { createStyles } from "antd-style";
import ButtonMod from "../base/Button";
import { Cart, Item } from "@/containers/product/ProductListContainer";

const useStyles = createStyles(({ token, css }) => ({
    img: css`
        border-radius: 5px;
    `,
    container: css`
        width: fit-content;
        padding: 0px ${token.padding}px;
        margin: ${token.margin}px 0px;
    `,
    name: css`
        font-weight: bold;
        color: #6e6c69;
    `,
    price: css`
        font-weight: bold;
    `,
    quantity: css`
        margin: 0px ${token.margin}px;
    `,
}));

type ProductProps = {
    item: Item;
    handleAddToCart: (productId: string) => void;
    handleRemoveFromCart: (productId: string) => void;
    cart: Cart;
};

export default function Product({
    item,
    cart,
    handleAddToCart,
    handleRemoveFromCart,
}: ProductProps) {
    const { styles } = useStyles();

    return (
        <Flex vertical justify="center" gap={18} className={styles.container}>
            <div>
                <Image
                    alt="cloth"
                    src="/jeans.jpg"
                    width={250}
                    height={300}
                    className={styles.img}
                    loading="eager"
                />
            </div>
            <Flex justify="space-between">
                <p className={styles.name}>{item.name}</p>
                <p className={styles.price}>{item.price}$</p>
            </Flex>
            <div style={{ marginLeft: "auto" }}>
                {cart[item.catalogObjectId] ? (
                    <div>
                        <ButtonMod
                            onClick={() =>
                                handleRemoveFromCart(item.catalogObjectId)
                            }
                        >
                            -
                        </ButtonMod>
                        <span className={styles.quantity}>
                            {cart[item.catalogObjectId]}
                        </span>
                        <ButtonMod
                            onClick={() =>
                                handleAddToCart(item.catalogObjectId)
                            }
                        >
                            +
                        </ButtonMod>
                    </div>
                ) : (
                    <ButtonMod
                        onClick={() => handleAddToCart(item.catalogObjectId)}
                    >
                        Add To Cart
                    </ButtonMod>
                )}
            </div>
        </Flex>
    );
}
