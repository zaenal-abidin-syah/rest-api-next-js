import { createUser } from "../../../../utils/dbUtils/user";
import { NextResponse } from "next/server";
import z from "zod";

const createUserSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    username: z.string().min(3).max(20),
    fullname: z.string().nullable().optional(),
  })
  .strict();

const validateUserSchema = (data) => {
  try {
    const parseData = createUserSchema.parse({
      email: data.email,
      password: data.password,
      username: data.username,
      fullname: data.fullname,
    });
    return parseData;
  } catch (error) {
    throw new Error(error.errors[0].message.message);
  }
};

export const POST = async (req) => {
  try {
    const data = await req.json();
    const validateUser = validateUserSchema(data);

    const createUserResult = await createUser(validateUser);
    return NextResponse.json(
      {
        message: "User created successfully",
        data: createUserResult,
      },
      {
        status: 201,
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
