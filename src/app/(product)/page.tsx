import ProductListContainer from "@/src/containers/product/ProductListContainer";
import { BASE_URL_API } from "@/src/utils/constants";
import { SessionData, sessionOptions } from "@/src/utils/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

async function getProducts(token: string) {
    const res = await fetch(
        `${BASE_URL_API}/api/search-catalog-items?categoryId=&textFilter=&cursor=`,
        {
            method: "GET",
            headers: {
                Authorization: token,
            },
            cache: "no-store", // Optional: Disable caching for fresh data
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    return res.json();
}

export default async function ProductPage() {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );

    const products = await getProducts(session.token).then(
        (data) => data.result
    );

    return <ProductListContainer initialProducts={products} />;
}
