type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
};

export const useFetch = async (
    url: string,
    headers?: Record<string, string>,
    method: FetchOptions["method"] = "GET",
    payload?: any
) => {
    try {
        const options: FetchOptions = {
            method,
            headers,
        };

        if (payload && method !== "GET") {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.log(error);
    }
};
