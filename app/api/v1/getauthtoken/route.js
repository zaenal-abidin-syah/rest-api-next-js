import { generateToken } from "@/utils/tokenUtils/getToken";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const authToken = req.headers.get("Authorization");
    if (!authToken) {
      throw new Error("Authorization header is missing");
    }
    const base64EncodedHeader = JSON.stringify(authToken, null, 2);
    const base64Credential = base64EncodedHeader.split(" ")[1];
    const credetailBuffer = Buffer.from(base64Credential, "base64");
    const decodedHeader = credetailBuffer.toString("utf-8");
    const [email, password] = decodedHeader.split(":");
    const token = await generateToken(email, password);
    return NextResponse.json(
      {
        message: "Token generated successfully",
        token,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
