import "@/matchmedia";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Product from "@/src/components/composite/Product";

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />;
    },
}));

describe("Product", () => {
    const item = {
        catalogObjectId: "IF3NFMDLHJ5TCBODJUSZF73L",
        name: "Item 1",
        variations: [
            {
                variationId: "B7UAU7JBWSIXH5RIDTU4FO6S",
                variant: "Regular",
                price: {
                    amount: 6000,
                    currency: "USD",
                },
            },
        ],
        imageUrl: "",
        incrementable: true,
        taxIds: ["N6RYDKKYY4ZQQMWSJHYLDEIS"],
    };
    let cart: any = {};
    const handle = jest.fn();

    it("should render the product details correctly", () => {
        render(
            <Product
                item={item}
                cart={cart}
                handleAddToCart={handle}
                handleRemoveFromCart={handle}
            />
        );

        // Checking if the image is rendered with the correct source
        expect(screen.getByAltText("cloth")).toHaveAttribute(
            "src",
            "/jeans.jpg"
        );

        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("$60")).toBeInTheDocument();
    });

    it("should check if the add to cart button is rendered, adding an item to the cart and removing an item from the cart", () => {
        const handleAddToCart = jest.fn((catalogObjectId, item) => {
            cart = {
                ...cart,
                [catalogObjectId]: { quantity: 1, item },
            };
        });
        const handleRemoveFromCart = jest.fn((productId) => {
            delete cart[productId];
        });

        const { rerender } = render(
            <Product
                item={item}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        );

        const addToCartButton = screen.getByText("Add To Cart");

        fireEvent.click(addToCartButton);

        expect(handleAddToCart).toHaveBeenCalledWith(
            item.catalogObjectId,
            item
        );

        rerender(
            <Product
                item={item}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        );

        const removeButton = screen.getByText("-");
        expect(removeButton).toBeInTheDocument();

        fireEvent.click(removeButton);

        expect(handleRemoveFromCart).toHaveBeenCalledWith(item.catalogObjectId);

        rerender(
            <Product
                item={item}
                cart={cart}
                handleAddToCart={handleAddToCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        );

        const newAddToCartBtn = screen.getByText("Add To Cart");
        expect(newAddToCartBtn).toBeInTheDocument();
    });
});
