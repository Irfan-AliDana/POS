import { defaultSession, SessionData, sessionOptions } from "@/utils/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );

    if (session.isLoggedIn !== true) {
        return NextResponse.json(defaultSession);
    }

    return NextResponse.json(session);
}
