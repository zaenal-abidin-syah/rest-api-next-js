import { getUserByEmail } from "@/utils/dbUtils/user";

const { NextResponse } = require("next/server");
const { validateToken } = require("@/utils/tokenUtils/validateToken");

const {
  getLoanById,
  deleteLoans,
  updateLoans,
} = require("@/utils/dbUtils/loan");

export const GET = async (req, { params }) => {
  try {
    const token = req.headers.get("Authorization");
    if (!token) {
      throw new Error("Authorization header is missing");
    }
    const decodedToken = await validateToken(token.split(" ")[1]);
    let { id } = await params;
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }
    const data = await getLoanById(id);

    return NextResponse.json(
      {
        message: "successfully loan by id",
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
    if (!token) {
      throw new Error("Authorization header is missing");
    }
    let { id } = await params;
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }

    const decodedToken = await validateToken(token.split(" ")[1]);
    const result = await deleteLoans(id);

    return NextResponse.json(
      {
        message: "delete loans successfully",
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
    if (!token) {
      throw new Error("Authorization header is missing");
    }
    let { id } = await params;
    let dataJson = await req.json();
    id = parseInt(id);
    if (!id) {
      throw new Error("Invalid id");
    }
    dataJson.id = id;

    const decodedToken = await validateToken(token.split(" ")[1]);
    const result = await updateLoans(dataJson);

    return NextResponse.json(
      {
        message: "update loans successfully",
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
