import AppLayout from "@/src/components/layouts/AppLayout";
import Link from "next/link";
import { Drawer, Flex, MenuProps, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import CartDetails from "@/src/components/composite/CartDetails";
import { useCartStore } from "@/src/zustand/store/cart-store";
import { BASE_URL_API } from "@/src/utils/constants";
import SelectMod from "@/src/components/base/Select";
import { useSession } from "@/src/hooks/useSession";
import Spinner from "@/src/components/base/Spinner";
import { usePathname } from "next/navigation";
import { fetcher } from "@/src/utils/lib";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import CartItemsList from "@/src/components/layouts/CartItemsList";
// import HeavyComponent from "@/src/components/composite/HeavyComponent";

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

    const { data: discountData } = useSWR(
        sessionIsFetched
            ? `${BASE_URL_API}/api/get-discounts?type=DISCOUNT`
            : null,
        (url) => fetcher(url, session?.token)
    );

    const { data: taxData } = useSWR(
        sessionIsFetched ? `${BASE_URL_API}/api/get-tax?type=TAX` : null,
        (url) => fetcher(url, session?.token)
    );

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

    const updateUserData = async (url: string, { arg }: { arg: any }) => {
        const res = await fetcher(
            `${BASE_URL_API}/api/calculate-order`,
            session?.token,
            {
                "Content-Type": "application/json",
            },
            "POST",
            arg
        );

        return res;
    };

    const { trigger, isMutating } = useSWRMutation(
        `${BASE_URL_API}/api/calculate-order`,
        updateUserData,
        {
            onSuccess(data) {
                setCalculatedAmount(data.result);
            },
            onError(error) {
                console.log(error);
            },
        }
    );

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
        cartItemId?: string,
        itemDeleted?: boolean
    ) => {
        const discountArray = discountId.split(",");
        const lastDiscount = discountArray[discountArray.length - 1];

        if (type === "global") {
            setDiscount((prevData: any) => {
                if (itemDeleted && lastDiscount === "undefined") {
                    return prevData.filter((d: any) => d.scope !== "ORDER");
                }

                if (itemDeleted && lastDiscount !== "undefined") {
                    return prevData.filter(
                        (d: any) =>
                            !(
                                d.catalogObjectId === lastDiscount &&
                                d.scope === "ORDER"
                            )
                    );
                }

                const globalDiscountExists = prevData.find(
                    (d: any) =>
                        d.catalogObjectId === lastDiscount &&
                        d.scope === "ORDER"
                );

                if (globalDiscountExists) {
                    return prevData;
                }

                return [
                    ...prevData,
                    {
                        uid: lastDiscount,
                        catalogObjectId: lastDiscount,
                        scope: "ORDER",
                    },
                ];
            });
        } else {
            setDiscount((prevData: any) => {
                if (itemDeleted && lastDiscount !== "undefined") {
                    // Handle deleting a discount based on the cartItemId
                    const updatedDiscounts = (prevData || [])
                        ?.map((d: any) => {
                            if (!d.itemCatalogIds) return d;

                            if (d.catalogObjectId === lastDiscount) {
                                // If there's only one cart item ID, remove the discount
                                if (d.itemCatalogIds.length === 1) {
                                    return null; // Remove this discount
                                } else {
                                    // If there are multiple cart item IDs, filter out the specified cartItemId
                                    const updatedItemCatalogIds =
                                        d.itemCatalogIds.filter(
                                            (id: string) => id !== cartItemId
                                        );

                                    return {
                                        ...d,
                                        itemCatalogIds: updatedItemCatalogIds,
                                    };
                                }
                            }
                            return d;
                        })
                        .filter(Boolean);

                    return updatedDiscounts.length > 0 ? updatedDiscounts : [];
                }

                if (itemDeleted && lastDiscount === "undefined") {
                    // Filter out all discounts associated with the specified cart item ID
                    const updatedDiscounts = prevData
                        .map((discount: any) => {
                            if (!discount.itemCatalogIds) return discount;

                            const updatedItemCatalogIds =
                                discount.itemCatalogIds.filter(
                                    (id: string) => id !== cartItemId
                                );

                            if (updatedItemCatalogIds.length > 0) {
                                return {
                                    ...discount,
                                    itemCatalogIds: updatedItemCatalogIds,
                                };
                            }

                            // Return null if no items are left
                            return null;
                        })
                        .filter(Boolean); // Remove null values

                    return updatedDiscounts.length > 0 ? updatedDiscounts : [];
                }

                const existingDiscountIndex = prevData.findIndex(
                    (d: any) =>
                        d.catalogObjectId === lastDiscount &&
                        d.scope === "LINE_ITEM"
                );

                if (existingDiscountIndex > -1) {
                    // Discount already exists, so update it by adding `cartItemId` if not already present
                    const updatedDiscounts = [...prevData];
                    const existingDiscount =
                        updatedDiscounts[existingDiscountIndex];

                    if (!existingDiscount.itemCatalogIds.includes(cartItemId)) {
                        existingDiscount.itemCatalogIds = [
                            ...existingDiscount.itemCatalogIds,
                            cartItemId,
                        ];
                    }

                    updatedDiscounts[existingDiscountIndex] = existingDiscount;
                    return updatedDiscounts;
                }

                return [
                    ...prevData,
                    {
                        catalogObjectId: lastDiscount,
                        uid: lastDiscount,
                        itemCatalogIds: [cartItemId],
                        scope: "LINE_ITEM",
                    },
                ];
            });
        }
    };

    const handleTax = (taxId: string, type: string, cartItemId?: string) => {
        const taxArray = taxId.split(",");
        const lastTax = taxArray[taxArray.length - 1];

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

                const existingTaxIndex = prevData.findIndex(
                    (t: any) =>
                        t.catalogObjectId === lastTax && t.scope === "LINE_ITEM"
                );

                if (existingTaxIndex > -1) {
                    const updatedTaxes = [...prevData];
                    const existingTax = updatedTaxes[existingTaxIndex];

                    if (!existingTax.itemCatalogIds.includes(cartItemId)) {
                        existingTax.itemCatalogIds = [
                            ...existingTax.itemCatalogIds,
                            cartItemId,
                        ];
                    }

                    updatedTaxes[existingTaxIndex] = existingTax;
                    return updatedTaxes;
                }

                return [
                    ...prevData,
                    {
                        catalogObjectId: lastTax,
                        uid: lastTax,
                        itemCatalogIds: [cartItemId],
                        scope: "LINE_ITEM",
                    },
                ];
            });
        }
    };

    const handleDeleteFromCart = (
        productId: string,
        discountId: string,
        cartItemId: string
    ) => {
        deleteFromCart(productId);
        handleDiscount("undefined", "inline", cartItemId, true);
        // handleTax(discountId, "inline", cartItemId);
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
                    handleDeselect={(value: string) => {
                        handleDiscount(value, "global", undefined, true);
                    }}
                    mode="multiple"
                    handleClear={() => {
                        handleDiscount("undefined", "global", undefined, true);
                    }}
                    onSelect
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
                    handleDeselect={(value: string) => {
                        handleDiscount(value, "global", undefined, true);
                    }}
                    mode="multiple"
                    handleClear={() => {
                        handleDiscount("undefined", "global", undefined, true);
                    }}
                    onSelect
                />
            </Space>
            <Space>
                <h4>Total</h4>
                {isMutating ? (
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
            {isMutating ? (
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
            trigger(transformedOrder as any);
        }
    }, [order, trigger]);

    useEffect(() => {
        setPerItemPrice(0);
        setCalculatedAmount({});
        setDiscount([]);
        setTax([]);
    }, [discountType]);

    useEffect(() => {
        console.log("Discount", discount);

        const lineItems = cartKeys.map((key) => {
            const item = cart[key];

            const variationId = item.data.variations[0].variationId;

            // Inline discounts
            const appliedDiscounts = discount
                ?.filter(
                    (d: any) =>
                        d.itemCatalogIds &&
                        d.itemCatalogIds.includes(variationId)
                )
                .map((d: any) => ({ discountUid: d.uid }));

            console.log("Applied Discounts", appliedDiscounts);

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

    const HeavyComponent = lazy(
        () => import("../../components/composite/HeavyComponent")
    );

    return (
        <AppLayout
            items={getItems(itemsCount, handleShowDrawer, styles)}
            currentPath={pathname}
        >
            <Drawer
                title={header}
                onClose={handleCloseDrawer}
                open={open}
                width={600}
                footer={discountType === "global" ? footer : totalOnlyFooter}
                mask={false}
            >
                {/* <div>Hello World!</div> */}

                <Suspense fallback={<Spinner />}>
                    <CartItemsList
                        cartKeys={cartKeys}
                        cart={cart}
                        handleDiscount={handleDiscount}
                        handleTax={handleTax}
                        discountOptions={transformedDiscount}
                        taxOptions={transformedTax}
                        handleAddToCart={handleAddToCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                        handleDeleteFromCart={handleDeleteFromCart}
                        calculatedAmount={calculatedAmount}
                        perItemPrice={perItemPrice}
                    />
                    {/* <HeavyComponent /> */}
                </Suspense>
            </Drawer>
            {children}
        </AppLayout>
    );
}
