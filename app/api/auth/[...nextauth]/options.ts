import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        {
            id: "square",
            name: "Square",
            type: "oauth",
            authorization: {
                url: "https://connect.squareup.com/oauth2/authorize",
                // url: "https://connect.squareupsandbox.com/oauth2/authorize",
                params: {
                    scope: "MERCHANT_PROFILE_READ,CUSTOMERS_WRITE,CUSTOMERS_READ",
                    redirect_uri:
                        "https://myapp.local:3000/api/auth/callback/square",
                },
            },
            token: {
                url: "https://connect.squareup.com/oauth2/token",
                // url: "https://connect.squareupsandbox.com/oauth2/token",
            },
            profileUrl: "https://connect.squareup.com/v2/merchants/me",
            clientId: process.env.SQUARE_CLIENT_ID,
            clientSecret: process.env.SQUARE_CLIENT_SECRET,
            checks: ["state"],
            profile(profile) {
                return {
                    id: profile.merchant.id,
                    name: profile.merchant.business_name,
                    email: profile.merchant.email,
                };
            },
        },
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
    debug: true,
};
