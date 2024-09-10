import { CartItem } from "@/containers/product/ProductListContainer";
import { Flex, Space } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        background: #f7f7f7;
        border-radius: 5px;
        padding: 10px;
    `,
}));

type CartDetailsProps = {
    cart: CartItem;
};

export default function CartDetails({ cart }: CartDetailsProps) {
    const { styles } = useStyles();

    return (
        <Flex justify="space-between" align="end" className={styles.container}>
            <Flex vertical gap={10}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {cart.data.name}
                </h3>
                <Space>
                    <p>Price: {cart.data.variations[0].price.amount / 100}$</p>
                    <p>Quantity: {cart.quantity}</p>
                </Space>
            </Flex>
            <p style={{ fontWeight: "bold" }}>10</p>
        </Flex>
    );
}
