import { NextResponse } from "next/server";

export async function GET() {
    const res = await fetch("https://connect.squareup.com/v2/catalog/list", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        throw new Error("Something went wrong");
    }

    const responseData = await res.json();

    return NextResponse.json({ data: responseData }, { status: 200 });
}
