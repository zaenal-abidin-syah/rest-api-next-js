import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/utils/dbUtils/user";
import prisma from "@/lib/prismaClient";

export const generateToken = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user || !(await compare(password, user.password))) {
      throw new Error("Invalid Credentials");
    }
    // 1. Tentukan TTL dalam detik (misal 1 jam = 3600 s)
    const ttlSeconds = 60 * 60;
    const now = Math.floor(Date.now() / 1000); // sekarang dalam detik UNIX
    const exp = now + ttlSeconds; // exp dalam detik UNIX

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        password: user.password,
        exp: exp, // waktu kedaluwarsa token
      },
      process.env.JWT_SECRET
    );

    await prisma.token.upsert({
      where: {
        user_id: user.id,
      },
      create: {
        user_id: user.id,
        token,
      },
      update: {
        token,
      },
    });
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};
