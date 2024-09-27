import { SessionOptions } from "iron-session";

export interface SessionData {
    isLoggedIn: boolean;
    token: string;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    token: "",
};

export const sessionOptions: SessionOptions = {
    password: `mNk]SB4Y5am9(L7e?:kMV^m=W%4a1s23`,
    cookieName: "auth-session",
    cookieOptions: {
        // secure only works in `https` environments
        // if your localhost is not on `https`, then use: `secure: process.env.NODE_ENV === "production"`
        secure: true,
    },
};

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: any;
};

export const customFetch = async (
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
        throw new Error("Something went wrong");
    }
};
