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
import Spinner from "@/src/components/base/Spinner";
import { usePathname } from "next/navigation";
import { customFetch } from "@/src/utils/lib";

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

const getItems = (itemsCount: any, showDrawer: () => void, styles: any) => {
    const item: MenuItem[] = [
        {
            label: <Link href="/login">Login</Link>,
            key: "/login",
        },
        {
            label: <Link href="/">Home</Link>,
            key: "/",
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
    const pathname = usePathname();

    const [discount, setDiscount] = useState<any>([]);
    const [tax, setTax] = useState<any>([]);
    const [calculatedAmount, setCalculatedAmount] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState<CalculateOrderRequestDto>(
        defaultOrder as CalculateOrderRequestDto
    );
    const [discountType, setDiscountType] = useState<DiscountAndTax>("global");
    const [perItemPrice, setPerItemPrice] = useState(0);

    const cart = useCartStore((state) => state.cart);
    const handleAddToCart = useCartStore((state) => state.addToCart);
    const handleRemoveFromCart = useCartStore((state) => state.removeFromCart);
    const deleteFromCart = useCartStore((state) => state.deleteFromCart);

    const cartKeys = Object.keys(cart);

    const { session, sessionIsFetched } = useSession();

    const { data: discountData } = useQuery({
        queryKey: ["discount", sessionIsFetched],
        queryFn: () =>
            customFetch(`${BASE_URL_API}/api/get-discounts?type=DISCOUNT`, {
                Authorization: session?.token,
            }),
        enabled: !!session?.token,
    });

    const { data: taxData } = useQuery({
        queryKey: ["tax", sessionIsFetched],
        queryFn: () =>
            customFetch(`${BASE_URL_API}/api/get-tax?type=TAX`, {
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

    const { mutate, isPending } = useMutation({
        mutationFn: (order) =>
            customFetch(
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

    const handleDiscount = (
        discountId: string,
        type: string,
        cartItemId?: string
    ) => {
        if (type === "global") {
            setDiscount((prevData: any) => {
                if (discountId === "undefined") {
                    // Remove only global (ORDER scope) discounts, keep other discounts.
                    return prevData.filter((d: any) => d.scope !== "ORDER");
                }
                return [
                    ...prevData.filter((d: any) => d.scope !== "ORDER"),
                    {
                        uid: discountId,
                        catalogObjectId: discountId,
                        scope: "ORDER",
                    },
                ];
            });
        } else {
            setDiscount((prevData: any) => {
                if (discountId === "undefined") {
                    // Find the existing discount for this item.
                    const updatedDiscounts = prevData
                        .map((d: any) => {
                            if (!d.itemCatalogIds) return d; // Skip if no itemCatalogIds exist.

                            // Remove the `cartItemId` from the discount's `itemCatalogIds`.
                            const updatedItemCatalogIds =
                                d.itemCatalogIds.filter(
                                    (id: string) => id !== cartItemId
                                );

                            // If there are still items left, update the discount.
                            if (updatedItemCatalogIds.length > 0) {
                                return {
                                    ...d,
                                    itemCatalogIds: updatedItemCatalogIds,
                                };
                            }

                            // Return null if no items are left.
                            return null;
                        })
                        .filter(Boolean); // Remove null values.

                    return updatedDiscounts;
                }
                let found = false; // Track if the new discount was found and updated

                const updatedDiscounts = prevData
                    .map((discount: any) => {
                        // Remove cartItemId from any existing discount's itemCatalogIds
                        if (discount.itemCatalogIds?.includes(cartItemId)) {
                            return {
                                ...discount,
                                itemCatalogIds: discount.itemCatalogIds.filter(
                                    (id: string) => id !== cartItemId
                                ),
                            };
                        }

                        // If this is the new discount, add the cartItemId to it
                        if (
                            discount.catalogObjectId === discountId &&
                            discount.scope === "LINE_ITEM"
                        ) {
                            found = true;
                            return {
                                ...discount,
                                itemCatalogIds: [
                                    ...(discount.itemCatalogIds || []),
                                    cartItemId,
                                ],
                            };
                        }

                        // Return other discounts unchanged
                        return discount;
                    })
                    .filter(
                        (discount: any) =>
                            discount.itemCatalogIds?.length > 0 ||
                            discount.scope === "ORDER"
                    );

                // If the discount is not found, add it as a new one
                if (!found) {
                    updatedDiscounts.push({
                        catalogObjectId: discountId,
                        uid: discountId,
                        itemCatalogIds: [cartItemId],
                        scope: "LINE_ITEM",
                    });
                }

                return updatedDiscounts;
            });
        }
    };

    const handleTax = (taxId: string, type: string, cartItemId?: string) => {
        if (type === "global") {
            setTax((prevData: any) => {
                if (taxId === "undefined") {
                    return prevData.filter((d: any) => d.scope !== "ORDER");
                }

                return [
                    ...prevData.filter((d: any) => d.scope !== "ORDER"),
                    {
                        uid: taxId,
                        catalogObjectId: taxId,
                        scope: "ORDER",
                    },
                ];
            });
        } else {
            setTax((prevData: any) => {
                if (taxId === "undefined") {
                    const updatedTaxes = prevData
                        .map((tax: any) => {
                            if (!tax.itemCatalogIds) return tax;

                            const updatedItemCatalogIds =
                                tax.itemCatalogIds.filter(
                                    (id: string) => id !== cartItemId
                                );

                            if (updatedItemCatalogIds.length > 0) {
                                return {
                                    ...tax,
                                    itemCatalogIds: updatedItemCatalogIds,
                                };
                            }

                            // Return null if no items are left.
                            return null;
                        })
                        .filter(Boolean); // Remove null values.

                    return updatedTaxes;
                }

                let found = false;

                const updatedTaxes = prevData
                    .map((tax: any) => {
                        if (tax.itemCatalogIds?.includes(cartItemId)) {
                            return {
                                ...tax,
                                itemCatalogIds: tax.itemCatalogIds.filter(
                                    (id: string) => id !== cartItemId
                                ),
                            };
                        }

                        if (
                            tax.catalogObjectId === taxId &&
                            tax.scope === "LINE_ITEM"
                        ) {
                            found = true;
                            return {
                                ...tax,
                                itemCatalogIds: [
                                    ...(tax.itemCatalogIds || []),
                                    cartItemId,
                                ],
                            };
                        }

                        // Return other taxs unchanged
                        return tax;
                    })
                    .filter(
                        (tax: any) =>
                            tax.itemCatalogIds?.length > 0 ||
                            tax.scope === "ORDER"
                    );

                // If the discount is not found, add it as a new one
                if (!found) {
                    updatedTaxes.push({
                        catalogObjectId: taxId,
                        uid: taxId,
                        itemCatalogIds: [cartItemId],
                        scope: "LINE_ITEM",
                    });
                }

                return updatedTaxes;
            });
        }
    };

    const handleDeleteFromCart = (
        productId: string,
        discountId: string,
        cartItemId: string
    ) => {
        deleteFromCart(productId);
        handleDiscount(discountId, "inline", cartItemId);
        handleTax(discountId, "inline", cartItemId);
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
                        handleDiscount(`${value}`, "global");
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
                        handleTax(`${value}`, "global");
                    }}
                    options={transformedTax}
                />
            </Space>
            <Space>
                <h4>Total</h4>
                {isPending ? (
                    <Spinner size={20} />
                ) : (
                    <span>
                        $
                        {calculatedAmount?.netAmounts?.totalMoney.amount /
                            100 || "0"}
                    </span>
                )}
            </Space>
        </Space>
    );

    const totalOnlyFooter = (
        <Space>
            <h4>Total</h4>
            {isPending ? (
                <Spinner size={20} />
            ) : (
                <span>
                    $
                    {calculatedAmount?.netAmounts?.totalMoney.amount / 100 ||
                        "0"}
                </span>
            )}
        </Space>
    );

    const header = (
        <Flex justify="space-between" align="center">
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
        const hasLineItems = order?.lineItems.length > 0;

        if (hasLineItems) {
            const transformedOrder = {
                order: {
                    ...order,
                },
            };
            mutate(transformedOrder as any);
        }
    }, [order, mutate]);

    useEffect(() => {
        setPerItemPrice(0);
        setCalculatedAmount({});
        setDiscount([]);
        setTax([]);
    }, [discountType]);

    useEffect(() => {
        const lineItems = cartKeys.map((key) => {
            const item = cart[key];

            const variationId = item.data.variations[0].variationId;

            // Inline discounts
            const appliedDiscounts = discount
                .filter(
                    (d: any) =>
                        d.itemCatalogIds &&
                        d.itemCatalogIds.includes(variationId)
                )
                .map((d: any) => ({ discountUid: d.uid }));

            const appliedTaxes = tax
                .filter(
                    (t: any) =>
                        t.itemCatalogIds &&
                        t.itemCatalogIds.includes(variationId)
                )
                .map((t: any) => ({ taxUid: t.uid }));

            return {
                quantity: item.quantity.toString(),
                catalogObjectId: variationId,
                itemType: "ITEM",
                appliedDiscounts,
                appliedTaxes,
            };
        });

        setOrder((prevOrder) => ({
            ...prevOrder,
            lineItems,
            discounts: discount,
            taxes: tax,
        }));
    }, [discount, tax, cart]);

    useEffect(() => {
        if (Object.keys(cart).length <= 0) {
            setCalculatedAmount({});
        }
    }, [cart]);

    return (
        <AppLayout
            items={getItems(itemsCount, handleShowDrawer, styles)}
            currentPath={pathname}
        >
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
                                    handleAddToCart={handleAddToCart}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    handleDeleteFromCart={handleDeleteFromCart}
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
