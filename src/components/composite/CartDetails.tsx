import { CartItem } from "@/src/containers/product/ProductListContainer";
import { Flex, Space } from "antd";
import { createStyles } from "antd-style";
import SelectMod from "../base/Select";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        background: #f7f7f7;
        border-radius: 5px;
        padding: 10px;
    `,
}));

type CartDetailsProps = {
    cart: CartItem;
    handleDiscount: (value: string, cart: CartItem) => void;
    handleTax: (value: string, productId: string) => void;
    discountOptions: { label: string; value: number }[];
    taxOptions: { label: string; value: number }[];
    finalPrice: number;
};

export default function CartDetails({
    cart,
    handleDiscount,
    handleTax,
    discountOptions,
    taxOptions,
    finalPrice,
}: CartDetailsProps) {
    const { styles } = useStyles();

    console.log(cart);

    return (
        <Flex
            justify="space-between"
            align="start"
            className={styles.container}
        >
            <Flex vertical gap={10}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {cart.data.name}
                </h3>
                <Space direction="vertical">
                    <p>Price: ${cart.data.variations[0].price.amount / 100}</p>
                    <p>Quantity: {cart.quantity}</p>
                    <p>Final: ${finalPrice}</p>
                </Space>
            </Flex>
            <Space direction="vertical">
                <SelectMod
                    showSearch
                    placeholder="Select Discount"
                    handleDropdown={(value) => {
                        handleDiscount(`${value}`, cart);
                    }}
                    options={discountOptions}
                />
                <SelectMod
                    showSearch
                    placeholder="Select Tax"
                    handleDropdown={(value) =>
                        handleTax(`${value}`, cart.data.catalogObjectId)
                    }
                    options={taxOptions}
                />
            </Space>
        </Flex>
    );
}
