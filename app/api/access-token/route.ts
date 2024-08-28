import { BASE_URL } from "@/utils/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // if (state != "82201dd8d83d23cc8a48caf52b") {
    //     return NextResponse.json(
    //         { error: "Invalid CSRF token" },
    //         { status: 400 }
    //     );
    // }

    try {
        const responseData = await fetch(
            "https://connect.squareup.com/oauth2/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: process.env.SQUARE_CLIENT_ID,
                    client_secret: process.env.SQUARE_CLIENT_SECRET,
                    code,
                    grant_type: "authorization_code",
                }),
            }
        );

        if (!responseData.ok) {
            return NextResponse.json({ error: "Token not received" });
        }

        const { access_token, refresh_token, expires_at } =
            await responseData.json();

        localStorage.setItem(
            "credentails",
            JSON.stringify({ access_token, refresh_token, expires_at })
        );

        return NextResponse.json(
            { success: "true", access_token, refresh_token, expires_at },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to obtain access token" },
            { status: 500 }
        );
    }
}
