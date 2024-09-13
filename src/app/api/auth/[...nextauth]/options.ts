// import { BASE_URL_API } from "@/src/utils/constants";
// import { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { NextResponse } from "next/server";

// const getUrl = () => {
//     // let authUrl = `${BASE_URL_API}/api/login`;
//     let authUrl = "";
//     const fetchUrl = async () => {
//         const res = await fetch(`${BASE_URL_API}/api/login`);

//         const { url } = await res.json();
//         authUrl = url;
//         console.log("Caleeeeeeeed");
//     };

//     fetchUrl();

//     return authUrl;
// };

// export const authOptions: NextAuthOptions = {
//     // providers: [
//     //     Credentials({
//     //         id: "square",
//     //         name: "square",
//     //         type: "credentials",
//     //         async authorize(credentials) {
//     //             try {
//     //                 const res = await fetch(
//     //                     `http://localhost:5000/api/access-token?code=${credentials.authorizationCode}`
//     //                 );

//     //                 const data = await res.json();

//     //                 if (res.ok && data.access_token) {
//     //                     return {
//     //                         accessToken: data.access_token,
//     //                         refreshToken: data.refresh_token,
//     //                         expires_at: data.expires_at,
//     //                     };
//     //                 } else {
//     //                     throw new Error("Failed to authorize");
//     //                 }
//     //             } catch (err) {
//     //                 console.log(err);
//     //                 return null;
//     //             }
//     //         },
//     //     }),
//     // ],
//     // callbacks: {
//     //     async signIn({ user, credentials }) {
//     //         console.log("hello world, Sign IN");
//     //         console.log("user", user);
//     //         console.log("credentials", credentials);
//     //         return true;
//     //     },
//     //     async jwt({ token, account }) {
//     //         if (account) {
//     //             console.log("Access Token", account.access_token);
//     //             token.accessToken = account.access_token;
//     //         }
//     //         console.log("Token", token);
//     //         return token;
//     //     },
//     //     async session({ session, token }) {
//     //         session.accessToken = token.accessToken;
//     //         return session;
//     //     },
//     // },
//     // debug: true,

//     providers: [
//         {
//             id: "square",
//             name: "Square",
//             type: "oauth",
//             authorization: {
//                 url,
//                 params: {
//                     redirect_uri:
//                         "https://localhost:3000/api/auth/callback/square",
//                 },
//             },
//             // token: {
//             //     url: `http://localhost:5000/api/access-token`,
//             //     // url: "https://connect.squareupsandbox.com/oauth2/token",
//             // },
//             profileUrl: "https://connect.squareup.com/v2/merchants/me",
//             clientId: process.env.SQUARE_CLIENT_ID,
//             clientSecret: process.env.SQUARE_CLIENT_SECRET,
//             checks: ["state"],
//             profile(profile) {
//                 return {
//                     id: profile.merchant.id,
//                     name: profile.merchant.business_name,
//                     email: profile.merchant.email,
//                 };
//             },
//         },
//     ],
//     callbacks: {
//         async signIn({ user, credentials }) {
//             console.log("hello world, Sign IN");
//             console.log("user", user);
//             console.log("credentials", credentials);
//             return true;
//         },
//         async redirect({ url }) {
//             console.log("asdfasd sadfa dfs asfUrl", url);
//             return url;
//         },
//         async jwt({ token, account }) {
//             if (account) {
//                 console.log("Access Token", account.access_token);
//                 token.accessToken = account.access_token;
//             }
//             console.log("Token", token);
//             return token;
//         },
//         async session({ session, token }) {
//             session.accessToken = token.accessToken;
//             return session;
//         },
//     },
//     // debug: true,
// };
