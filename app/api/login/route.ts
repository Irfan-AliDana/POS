import { NextResponse } from "next/server";

export async function GET() {
    const clientId = process.env.SQUARE_CLIENT_ID;
    const squareAuthUrl = `https://connect.squareup.com/oauth2/authorize?client_id=${clientId}&scope=CUSTOMERS_WRITE+CUSTOMERS_READ&session=false&state=82201dd8d83d23cc8a48caf52b`;

    return NextResponse.redirect(squareAuthUrl);
}
