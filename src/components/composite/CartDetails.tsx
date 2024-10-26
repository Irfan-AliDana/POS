import {
    Cart,
    CartItem,
    Item,
} from "@/src/containers/product/ProductListContainer";
import { Flex, Space } from "antd";
import { createStyles } from "antd-style";
import SelectMod from "../base/Select";
import { DiscountAndTax } from "@/src/containers/layout/LayoutContainer";
import ButtonMod from "../base/Button";
import { CloseCircleOutlined } from "@ant-design/icons";

const useStyles = createStyles(({ token, css }) => ({
    container: css`
        background: #f7f7f7;
        border-radius: 5px;
        padding: 10px;
    `,
    quantity: css`
        margin: 0px ${token.margin}px;
    `,
}));

type CartDetailsProps = {
    cart: CartItem;
    handleDiscount: (value: string, type: string, productId: string) => void;
    handleTax: (value: string, type: string, productId: string) => void;
    discountOptions: { label: string; value: number }[];
    taxOptions: { label: string; value: number }[];
    finalPrice: number;
    type: DiscountAndTax;
    handleAddToCart: (productId: string, data: Item) => void;
    handleRemoveFromCart: (productId: string) => void;
    handleDeleteFromCart: (
        productId: string,
        discountId: string,
        cartItemId: string
    ) => void;
};

export default function CartDetails({
    cart,
    handleDiscount,
    handleTax,
    discountOptions,
    taxOptions,
    finalPrice,
    type,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteFromCart,
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

            <Space direction="vertical">
                <Flex justify="right" style={{ paddingBottom: "10px" }}>
                    <CloseCircleOutlined
                        onClick={() =>
                            handleDeleteFromCart(
                                cart.data.catalogObjectId,
                                "undefined",
                                cart.data.variations[0].variationId
                            )
                        }
                    />
                </Flex>
                <SelectMod
                    showSearch
                    placeholder="Select Discount"
                    handleDropdown={(value) => {
                        handleDiscount(
                            `${value}`,
                            "inline",
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
                            "inline",
                            cart.data.variations[0].variationId
                        )
                    }
                    options={taxOptions}
                />
                <Flex align="center">
                    <ButtonMod
                        onClick={() =>
                            handleRemoveFromCart(cart.data.catalogObjectId)
                        }
                    >
                        -
                    </ButtonMod>
                    <span className={styles.quantity}>{cart.quantity}</span>
                    <ButtonMod
                        onClick={() =>
                            handleAddToCart(
                                cart.data.catalogObjectId,
                                cart.data
                            )
                        }
                    >
                        +
                    </ButtonMod>
                </Flex>
            </Space>
        </Flex>
    );
}
