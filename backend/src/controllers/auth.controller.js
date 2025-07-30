import prisma from "../prismaClient/prismaClient.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    // checking for existing email
    const existingUser = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });
    console.log("existing email", existingUser);
    if (existingUser) {
      return res.status(400).json({ message: "Email Already exist" });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // genrate number btw 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const salt = await bcrypt.genSalt(10);
    const passwordEncrypt = await bcrypt.hash(password, salt);

    const data = {
      email: email,
      fullName: fullName,
      password: passwordEncrypt,
      profilePic: randomAvatar,
    };
    const newUser = await prisma.User.create({
      data: data,
      omit: { password: true }, //it adds the password in db but ommit to send it back i response
    });

    //generating an jwt auth token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent xss attack,
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", //prevent hrrp requests
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("error in signup", error);
  }
};

export const login = (req, res) => {
  res.send("login route");
  res.status(500).json({ message: "Server error" });
};

export const logout = (req, res) => {
  res.send("logout route");
};
