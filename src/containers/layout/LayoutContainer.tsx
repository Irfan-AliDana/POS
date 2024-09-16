import AppLayout from "@/src/components/layouts/AppLayout";
import Link from "next/link";
import { Drawer, Flex, MenuProps, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useEffect, useState } from "react";
import CartDetails from "@/src/components/composite/CartDetails";
import { useCartStore } from "@/src/zustand/store/cart-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL_API } from "@/src/utils/constants";
import SelectMod from "@/src/components/base/Select";
import { useSession } from "@/src/hooks/useSession";
import { useFetch } from "@/src/hooks/useFetch";
import { CartItem } from "../product/ProductListContainer";

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
    drawerCard: css`
        padding-bottom: 10px;
    `,
}));

export type MenuItem = Required<MenuProps>["items"][number];

export type CalculateOrderRequestDto = {
    locationId: string;
    lineItems: LineItemDto[];
    taxes: TaxDto[];
    discounts: DiscountDto[];
};

type LineItemDto = {
    quantity: string;
    catalogObjectId: string;
    itemType: string;
    appliedTaxes?: AppliedTaxDto[];
    appliedDiscounts?: AppliedDiscountDto[];
};

type AppliedTaxDto = {
    taxUid: string;
};

type AppliedDiscountDto = {
    discountUid: string;
};

type TaxDto = {
    uid: string;
    catalogObjectId: string;
    scope: string;
};

type DiscountDto = {
    uid: string;
    catalogObjectId: string;
    scope: string;
};

export type DiscountAndTax = "global" | "inline";

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

const typeOptions = [
    {
        label: "Global",
        value: "global",
    },
    {
        label: "Inline",
        value: "inline",
    },
];

const defaultOrder = {
    locationId: "LS39Z5XR173MZ",
    lineItems: [],
    discounts: [],
    taxes: [],
};

export default function LayoutContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    const { styles } = useStyles();

    const [discount, setDiscount] = useState<any>({});
    const [tax, setTax] = useState<any>({});
    const [calculatedAmount, setCalculatedAmount] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState<CalculateOrderRequestDto>(
        defaultOrder as CalculateOrderRequestDto
    );
    const [discountType, setDiscountType] = useState<DiscountAndTax>("global");
    const [totalPrice, setTotalPrice] = useState(0);
    const [perItemPrice, setPerItemPrice] = useState(0);

    const cart = useCartStore((state) => state.cart);

    const cartKeys = Object.keys(cart);

    const { session, sessionIsFetched } = useSession();

    const { data: discountData } = useQuery({
        queryKey: ["discount", sessionIsFetched],
        queryFn: () =>
            useFetch(`${BASE_URL_API}/api/get-discounts?type=DISCOUNT`, {
                Authorization: session?.token,
            }),
        enabled: !!session?.token,
    });

    const { data: taxData } = useQuery({
        queryKey: ["tax", sessionIsFetched],
        queryFn: () =>
            useFetch(`${BASE_URL_API}/api/get-tax?type=TAX`, {
                Authorization: session?.token,
            }),
        enabled: !!session?.token,
    });

    const transformedDiscount = discountData?.result.map(
        (discount: { id: string; name: string; percentage: string }) => ({
            label: discount.name,
            value: discount.id,
        })
    );

    const transformedTax = taxData?.result.map(
        (tax: { id: string; name: string; percentage: string }) => ({
            label: tax.name,
            value: tax.id,
        })
    );

    const { mutate } = useMutation({
        mutationFn: (order) =>
            useFetch(
                `${BASE_URL_API}/api/calculate-order`,
                {
                    "Content-Type": "application/json",
                    Authorization: session?.token,
                },
                "POST",
                order
            ),

        onSuccess(data, variables, context) {
            setCalculatedAmount(data.result);
        },
        onError(error, variables, context) {
            console.log(error);
        },
    });

    const totalQuantity =
        cartKeys?.map((key) => {
            let totalQuantity = 0;
            totalQuantity = totalQuantity + cart[key].quantity;
            return totalQuantity;
        }) || 0;

    const itemsCount = totalQuantity.reduce((prevValue, currVal) => {
        return prevValue + currVal;
    }, 0);

    const handleShowDrawer = () => {
        setOpen(true);
    };

    const handleCloseDrawer = () => {
        setOpen(false);
    };

    const handleDiscount = (discountId: string, cartItem?: CartItem | any) => {
        if (discountType === "global") {
            setDiscount({
                uid: discountId,
                catalogObjectId: discountId,
                scope: "ORDER",
            });
        } else {
            setDiscount((prevData: any) => [
                prevData,
                // [cartItem?.data.variations[0].variationId]: {
                //     discountUid: discountId,
                //     uid: discountId,
                // },
                {
                    catalogObjectId: discountId,
                    uid: discountId,
                    scope: "IN_LINE",
                },
            ]);
            // const updatedOrder = {
            //     ...order,
            //     lineItems: order.lineItems.map((item) => {
            //         console.log("Cart Item", cartItem);
            //         return item.catalogObjectId ===
            //             cartItem?.data.variations[0].variationId
            //             ? {
            //                   ...item,
            //                   appliedDiscounts: [
            //                       {
            //                           discountUid: discountId,
            //                           uid: discountId,
            //                       },
            //                   ],
            //               }
            //             : item;
            //     }),
            // };
            // setOrder(updatedOrder);
        }
    };

    const handleTax = (taxId: string) => {
        setOrder((prevData) => {
            return {
                ...prevData,
                taxes: [
                    {
                        uid: taxId,
                        catalogObjectId: taxId,
                        scope: "ORDER",
                    },
                ],
            };
        });
    };

    const handleTypeChange = (value: DiscountAndTax) => {
        setDiscountType(value);
    };

    const footer = (
        <Space>
            <Space>
                <h4>Discount</h4>
                <SelectMod
                    showSearch
                    placeholder="Apply Discount"
                    handleDropdown={(value) => {
                        handleDiscount(`${value}`);
                    }}
                    options={transformedDiscount}
                />
            </Space>
            <Space>
                <h4>Tax</h4>
                <SelectMod
                    showSearch
                    placeholder="Apply Tax"
                    handleDropdown={(value) => {
                        handleTax(`${value}`);
                    }}
                    options={transformedTax}
                />
            </Space>
            <Space>
                <h4>Total</h4>
                <span>
                    $
                    {calculatedAmount?.netAmounts?.totalMoney.amount / 100 ||
                        "0"}
                </span>
            </Space>
        </Space>
    );

    const totalOnlyFooter = (
        <Space>
            <h4>Total</h4>
            <span>
                ${calculatedAmount?.netAmounts?.totalMoney.amount / 100 || "0"}
            </span>
        </Space>
    );

    const header = (
        <Flex justify="space-between">
            <p>{`My Cart (${itemsCount})`}</p>
            <div style={{ width: "50%" }}>
                <SelectMod
                    showSearch={false}
                    placeholder="Discount Type"
                    handleDropdown={(value) =>
                        handleTypeChange(value as DiscountAndTax)
                    }
                    options={typeOptions}
                    defaultValue="global"
                    allowClear={false}
                />
            </div>
        </Flex>
    );

    useEffect(() => {
        const transformedCart = Object.values(cart).map(
            (cartItem) =>
                ({
                    quantity: `${cartItem.quantity}`,
                    catalogObjectId: cartItem.data.variations[0].variationId,
                    itemType: "ITEM",
                } as LineItemDto)
        );

        if (transformedCart.length !== 0) {
            setOrder((prevData) => ({
                ...prevData,
                lineItems: transformedCart,
            }));
        }
    }, [cart]);

    useEffect(() => {
        if (
            order.discounts.length &&
            order?.discounts[0]?.uid !== "undefined" &&
            // order.taxes.length &&
            // order?.taxes[0]?.uid !== "undefined" &&
            order?.lineItems.length
        ) {
            const transformedOrder = {
                order: {
                    ...order,
                },
            };
            mutate(transformedOrder as any);
        }
        console.log("Order", order);
    }, [order]);

    useEffect(() => {
        setTotalPrice(0);
        setPerItemPrice(0);
        setCalculatedAmount({});
        setDiscount({});
    }, [discountType]);

    useEffect(() => {
        if (discountType === "global") {
            setOrder((prevData) => {
                return {
                    ...prevData,
                    discounts: [discount],
                };
            });
        } else {
            console.log(discount);
        }
    }, [discount, tax]);

    return (
        <AppLayout items={getItems(itemsCount, handleShowDrawer)}>
            <Drawer
                title={header}
                onClose={handleCloseDrawer}
                open={open}
                width={500}
                footer={discountType === "global" ? footer : totalOnlyFooter}
            >
                {cartKeys.length > 0 ? (
                    cartKeys.map((key) => {
                        const listItem = calculatedAmount?.lineItems?.filter(
                            (item: any) => {
                                return (
                                    cart[key].data.variations[0].variationId ===
                                    item.catalogObjectId
                                );
                            }
                        );

                        let finalPrice = perItemPrice;
                        if (listItem) {
                            finalPrice = listItem[0]?.totalMoney?.amount / 100;
                        }

                        return (
                            <div className={styles.drawerCard} key={key}>
                                <CartDetails
                                    cart={cart[key]}
                                    handleDiscount={handleDiscount}
                                    handleTax={handleTax}
                                    discountOptions={transformedDiscount}
                                    taxOptions={transformedTax}
                                    finalPrice={
                                        finalPrice !== 0
                                            ? finalPrice
                                            : cart[key].data.variations[0].price
                                                  .amount / 100
                                    }
                                    type={discountType}
                                />
                            </div>
                        );
                    })
                ) : (
                    <h3>Your cart is empty!</h3>
                )}
            </Drawer>
            {children}
        </AppLayout>
    );
}
