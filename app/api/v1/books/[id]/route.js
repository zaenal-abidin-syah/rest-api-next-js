const { NextResponse } = require("next/server");
const { getBookById, deleteBook, updateBook } = require("@/utils/dbUtils/book");
const { validateToken } = require("@/utils/tokenUtils/validateToken");

export const GET = async (req, { params }) => {
  try {
    const token = req.headers.get("Authorization");
    const decodedToken = await validateToken(token.split(" ")[1]);
    let { id } = await params;
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }

    const data = await getBookById(id);

    return NextResponse.json(
      {
        message: "get book by id",
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
export const DELETE = async (req, { params }) => {
  try {
    const token = req.headers.get("Authorization");

    const decodedToken = await validateToken(token.split(" ")[1]);
    let { id } = await params;
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }

    const result = await deleteBook(id);

    return NextResponse.json(
      {
        message: "delete books successfully",
        result,
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

export const PUT = async (req, { params }) => {
  try {
    const token = req.headers.get("Authorization");
    const decodedToken = await validateToken(token.split(" ")[1]);
    let { id } = await params;
    let dataJson = await req.json();
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }
    dataJson.id = id;

    const result = await updateBook(dataJson, "PUT");

    return NextResponse.json(
      {
        message: "update books successfully",
        result,
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
export const PATCH = async (req, { params }) => {
  try {
    const token = req.headers.get("Authorization");
    const decodedToken = await validateToken(token.split(" ")[1]);
    let { id } = await params;
    let dataJson = await req.json();
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }
    dataJson.id = id;
    console.log("dataJson", dataJson);
    const result = await updateBook(dataJson, "PATCH");

    return NextResponse.json(
      {
        message: "update books successfully",
        result,
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
