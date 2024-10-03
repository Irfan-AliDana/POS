import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { SessionData, sessionOptions } from "./utils/lib";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );

    if (session.isLoggedIn && pathname === "/login")
        return NextResponse.redirect(new URL("/", req.url));

    if (!session.isLoggedIn && pathname === "/")
        return NextResponse.redirect(new URL("/login", req.url));

    return NextResponse.next();
}
