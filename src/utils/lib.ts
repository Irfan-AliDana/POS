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

export const fetcher = async (
    url: string,
    token?: string,
    headers?: Record<string, string>,
    method: FetchOptions["method"] = "GET",
    payload?: any
) => {
    const options: FetchOptions = {
        method,
    };

    if (token) {
        options.headers = {
            Authorization: token as string,
            ...headers,
        };
    }

    if (payload && method !== "GET") {
        options.body = JSON.stringify(payload);
    }

    const res = await fetch(url, options);

    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    return res.json();
};
