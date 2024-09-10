import { BASE_URL } from "@/utils/constants";
import { SessionData, sessionOptions } from "@/utils/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    try {
        const responseData = await fetch(
            `http://localhost:5000/api/access-token?code=${code}`
        );

        if (!responseData.ok) {
            return NextResponse.json({ error: "Token not received" });
        }

        const { result } = await responseData.json();

        const session = await getIronSession<SessionData>(
            cookies(),
            sessionOptions
        );

        session.isLoggedIn = true;
        session.token = result.token;
        await session.save();

        return NextResponse.redirect(`${BASE_URL}`);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
