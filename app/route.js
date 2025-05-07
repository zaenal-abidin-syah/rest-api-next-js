import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello world!" });
}

export async function POST(request) {
  const { name } = await request.json();
  return NextResponse.json({ message: `Hello ${name}! post` });
}
