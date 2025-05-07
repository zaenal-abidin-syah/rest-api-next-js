import jwt from "jsonwebtoken";

export const validateToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          throw new Error(err.message);
        }
        return decoded;
      }
    );
    if (decodedToken.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired");
    }
    return decodedToken;
  } catch (error) {
    throw new Error(error.message);
  }
};
