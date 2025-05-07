const { NextResponse } = require("next/server");
const { getAllBooks, createBook } = require("@/utils/dbUtils/book");
const { validateToken } = require("@/utils/tokenUtils/validateToken");

export const GET = async (req) => {
  try {
    const token = req.headers.get("Authorization");

    const decodedToken = await validateToken(token.split(" ")[1]);
    const data = await getAllBooks();

    return NextResponse.json(
      {
        message: "successfully get all books",
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

    const decodedToken = await validateToken(token.split(" ")[1]);
    const dataJson = await req.json();
    let _ = await createBook(dataJson);

    return NextResponse.json(
      {
        message: "create books successfully",
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
