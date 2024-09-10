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
