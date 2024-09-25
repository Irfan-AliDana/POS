/**
 * @jest-environment jsdom
 */
import "@/matchmedia";
import { render, screen } from "@testing-library/react";
import CartDetails from "@/src/components/composite/CartDetails";

describe("CartDetails", () => {
    it("renders the cart object passed as a prop", () => {
        const cart = {
            quantity: 1,
            data: {
                catalogObjectId: "IF3NFMDLHJ5TCBODJUSZF73L",
                name: "Jeans 1",
                variations: [
                    {
                        variationId: "B7UAU7JBWSIXH5RIDTU4FO6S",
                        variant: "Regular",
                        price: {
                            amount: 4000,
                            currency: "USD",
                        },
                    },
                ],
                imageUrl: "",
                incrementable: true,
                taxIds: ["N6RYDKKYY4ZQQMWSJHYLDEIS"],
            },
        };

        const finalPrice = 40;

        const handleDiscount = (value: string, productId: string) => {
            console.log("discount");
        };

        const handleTax = (value: string, productId: string) => {
            console.log("Tax");
        };

        const taxOptions = [
            {
                label: "option1",
                value: 1,
            },
        ];

        const discountOptions = [
            {
                label: "option2",
                value: 2,
            },
        ];

        render(
            <CartDetails
                cart={cart}
                finalPrice={finalPrice}
                handleDiscount={handleDiscount}
                handleTax={handleTax}
                type="inline"
                taxOptions={taxOptions}
                discountOptions={discountOptions}
            />
        );

        const nameElement = screen.getByTestId("name");
        const priceElement = screen.getByTestId("price");
        const quantityElement = screen.getByTestId("quantity");
        const finalPriceElement = screen.getByTestId("final-price");

        expect(nameElement).toHaveTextContent(cart.data.name);
        expect(priceElement).toHaveTextContent(
            `Price: $${cart.data.variations[0].price.amount / 100}`
        );
        expect(quantityElement).toHaveTextContent(cart.quantity.toString());
        expect(finalPriceElement).toHaveTextContent(
            `Final: $${finalPrice.toString()}`
        );
    });
});
