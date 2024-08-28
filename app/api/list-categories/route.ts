import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const res = await fetch(
        "https://connect.squareup.com/v2/catalog/list?types=ITEM,CATEGORY",
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Something went wrong");
    }

    const responseData = await res.json();

    return NextResponse.json({ itemsData: responseData }, { status: 200 });
}

export async function POST(req: NextRequest) {
    const reqBody = await req.json();

    const res = await fetch(
        "https://connect.squareup.com/v2/catalog/batch-retrieve",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                object_ids: reqBody.image_ids,
            }),
        }
    );

    const responseData = await res.json();
    return NextResponse.json(
        { itemsImagesData: responseData },
        { status: 200 }
    );
}
