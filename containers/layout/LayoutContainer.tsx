import AppLayout from "@/components/layouts/AppLayout";
import Link from "next/link";
import { Drawer, MenuProps } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useState } from "react";
import CartDetails from "@/components/composite/CartDetails";
import { useCartStore } from "@/zustand/store/cart-store";

const useStyles = createStyles(({ token, css }) => ({
    cartItem: css`
        position: absolute;
        top: 0.3rem;
        left: 1rem;
        background-color: red;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        font-size: 13px;
        line-height: 0.2;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    cartContainer: css`
        position: relative;
    `,
    iconSize: css`
        font-size: 30px !important;
    `,
}));

export type MenuItem = Required<MenuProps>["items"][number];

const getItems = (itemsCount: any, showDrawer: () => void) => {
    const { styles } = useStyles();

    const item: MenuItem[] = [
        {
            label: <Link href="/login">Login</Link>,
            key: "login",
        },
        {
            label: <Link href="/">Home</Link>,
            key: "home",
        },
        {
            label: (
                <div className={styles.cartContainer} onClick={showDrawer}>
                    <div className={styles.cartItem}>{itemsCount}</div>
                    <ShoppingCartOutlined className={styles.iconSize} />
                </div>
            ),
            key: "cart",
        },
    ];

    return item;
};

export default function LayoutContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    const cart = useCartStore((state) => state.cart);

    const itemsCount = Object.values(cart).reduce((prevValue, currVal) => {
        return prevValue + currVal;
    }, 0);

    const handleShowDrawer = () => {
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <AppLayout items={getItems(itemsCount, handleShowDrawer)}>
            <Drawer
                title={`My Cart (5)`}
                onClose={handleCloseDrawer}
                open={open}
                width={500}
            >
                {<CartDetails />}
            </Drawer>
            {children}
        </AppLayout>
    );
}
