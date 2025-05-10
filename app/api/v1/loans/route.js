const { NextResponse } = require("next/server");
const { getAllLoans, createLoan } = require("@/utils/dbUtils/loan");
const { validateToken } = require("@/utils/tokenUtils/validateToken");
const { getUserByEmail } = require("@/utils/dbUtils/user");
export const GET = async (req) => {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      throw new Error("Authorization header is missing");
    }
    const decodedToken = await validateToken(token.split(" ")[1]);
    const data = await getAllLoans();

    return NextResponse.json(
      {
        message: "successfully get all loans",
        data,
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
export const POST = async (req) => {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      throw new Error("Authorization header is missing");
    }
    const decodedToken = await validateToken(token.split(" ")[1]);
    const dataJson = await req.json();
    const id = await getUserByEmail(decodedToken.email);
    dataJson.user_id = id.id;
    console.log({ dataJson });
    let _ = await createLoan(dataJson);

    return NextResponse.json(
      {
        message: "create loans successfully",
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
