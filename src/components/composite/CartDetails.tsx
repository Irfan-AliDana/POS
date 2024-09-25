import { CartItem } from "@/src/containers/product/ProductListContainer";
import { Flex, Space } from "antd";
import { createStyles } from "antd-style";
import SelectMod from "../base/Select";
import { DiscountAndTax } from "@/src/containers/layout/LayoutContainer";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        background: #f7f7f7;
        border-radius: 5px;
        padding: 10px;
    `,
}));

type CartDetailsProps = {
    cart: CartItem;
    handleDiscount: (value: string, productId: string) => void;
    handleTax: (value: string, productId: string) => void;
    discountOptions: { label: string; value: number }[];
    taxOptions: { label: string; value: number }[];
    finalPrice: number;
    type: DiscountAndTax;
};

export default function CartDetails({
    cart,
    handleDiscount,
    handleTax,
    discountOptions,
    taxOptions,
    finalPrice,
    type,
}: CartDetailsProps) {
    const { styles } = useStyles();

    return (
        <Flex
            justify="space-between"
            align="start"
            className={styles.container}
        >
            <Flex vertical gap={10}>
                <h3
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                    data-testid="name"
                >
                    {cart.data.name}
                </h3>
                <Space direction="vertical">
                    <p data-testid="price">
                        Price: ${cart.data.variations[0].price.amount / 100}
                    </p>
                    <p data-testid="quantity">Quantity: {cart.quantity}</p>
                    <p data-testid="final-price">Final: ${finalPrice}</p>
                </Space>
            </Flex>
            {type === "inline" && (
                <Space direction="vertical">
                    <SelectMod
                        showSearch
                        placeholder="Select Discount"
                        handleDropdown={(value) => {
                            handleDiscount(
                                `${value}`,
                                cart.data.variations[0].variationId
                            );
                        }}
                        options={discountOptions}
                    />
                    <SelectMod
                        showSearch
                        placeholder="Select Tax"
                        handleDropdown={(value) =>
                            handleTax(
                                `${value}`,
                                cart.data.variations[0].variationId
                            )
                        }
                        options={taxOptions}
                    />
                </Space>
            )}
        </Flex>
    );
}
