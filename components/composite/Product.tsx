"use client";

import { Flex } from "antd";
import Image from "next/image";
import { createStyles } from "antd-style";
import ButtonMod from "../base/Button";

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
}));

interface ProductProps {
    item: {
        name: string;
        price: string;
        addedToCart?: boolean;
    };
    handleAddToCart: (productId: string) => void;
    handleRemoveFromCart: (productId: string) => void;
    cart: Object;
}

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
                />
            </div>
            <Flex justify="space-between">
                <p className={styles.name}>{item.name}</p>
                <p className={styles.price}>{item.price}$</p>
            </Flex>
            <div style={{ marginLeft: "auto" }}>
                {cart[item.name] ? (
                    <div>
                        <ButtonMod
                            onClick={() => handleRemoveFromCart(item.name)}
                        >
                            -
                        </ButtonMod>
                        <span style={{ margin: "0 10px" }}>
                            {cart[item.name]}
                        </span>
                        <ButtonMod onClick={() => handleAddToCart(item.name)}>
                            +
                        </ButtonMod>
                    </div>
                ) : (
                    <ButtonMod onClick={() => handleAddToCart(item.name)}>
                        Add To Cart
                    </ButtonMod>
                )}
            </div>
        </Flex>
    );
}
