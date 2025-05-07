// import { Prisma } from "../../generated/prisma/Prisma";
import prisma from "../../lib/prismaClient";
import { hash } from "bcryptjs";

export const createUser = async (data) => {
  try {
    const { email, password, username, fullname } = data;
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }
    // check email duplicate
    const emailExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (emailExists) {
      throw new Error("Email already exists");
    }
    // Hash the password
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        fullname: fullname ?? undefined,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const getUserByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
