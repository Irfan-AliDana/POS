import { DiscountAndTax } from "@/src/containers/layout/LayoutContainer";
import {
    Cart,
    CartItem,
    Item,
} from "@/src/containers/product/ProductListContainer";
import CartDetails from "../composite/CartDetails";
import { MutableRefObject } from "react";

type CartItemsListProps = {
    cartKeys: string[];
    cart: Cart;
    handleDiscount: (value: string, type: string, productId: string) => void;
    handleTax: (value: string, type: string, productId: string) => void;
    discountOptions: { label: string; value: number }[];
    taxOptions: { label: string; value: number }[];
    handleAddToCart: (productId: string, data: Item) => void;
    handleRemoveFromCart: (productId: string) => void;
    handleDeleteFromCart: (
        productId: string,
        discountId: string,
        cartItemId: string
    ) => void;
    calculatedAmount: any;
    perItemPrice: number;
};

export default function CartItemsList({
    cartKeys,
    cart,
    handleDiscount,
    handleTax,
    discountOptions,
    taxOptions,
    handleAddToCart,
    handleRemoveFromCart,
    handleDeleteFromCart,
    calculatedAmount,
    perItemPrice,
}: CartItemsListProps) {
    return (
        <>
            {cartKeys.length > 0 ? (
                cartKeys.map((key: any) => {
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
                        <div style={{ paddingBottom: "10px" }} key={key}>
                            <CartDetails
                                cart={cart[key]}
                                handleDiscount={handleDiscount}
                                handleTax={handleTax}
                                discountOptions={discountOptions}
                                taxOptions={taxOptions}
                                finalPrice={
                                    finalPrice !== 0
                                        ? finalPrice
                                        : cart[key].data.variations[0].price
                                              .amount / 100
                                }
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
        </>
    );
}
