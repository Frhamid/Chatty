import jwt from "jsonwebtoken";
import prisma from "../prismaClient/prismaClient.js";
import dotenv from "dotenv";

dotenv.config();

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorize - No token provided" });

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decode)
      return res.status(401).json({ message: "Unauthorize - Invalid token" });

    const user = await prisma.User.findUnique({
      where: {
        id: decode?.userId,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { password, ...user1 } = user;
    req.user = { ...user1 };
    next();
  } catch (error) {
    console.log("Error in protect route middleare", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
