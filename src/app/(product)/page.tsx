import ProductListContainer from "@/src/containers/product/ProductListContainer";
import { BASE_URL_API } from "@/src/utils/constants";

// async function getSession() {
//     const res = await fetch("https://myapp.local:3000/api/get-session", {
//         method: "GET",
//         cache: "no-store",
//     });

//     if (!res.ok) {
//         throw new Error("Failed to fetch session token");
//     }

//     const data = await res.json();

//     console.log("Data", data);

//     return data;
// }

async function getProducts(token: string) {
    console.log("Token", token);

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
    // const token = await getSession();

    const products = await getProducts(`
eyJhbGciOiJIUzI1NiJ9.TUxEODI1MjNWV0ZGUw.NvAa40shtB2LjY736chOJU6J9tm5JRyDd_XQHu8lxMY`).then(
        (data) => data.result
    );

    return <ProductListContainer initialProducts={products} />;
}
