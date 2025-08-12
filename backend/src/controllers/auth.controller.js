import prisma from "../prismaClient/prismaClient.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
import cloudinary from "../lib/cloudinary.js";

//////////////////////////////////////////////////////Signup
export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    // checking for existing email
    const existingUser = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a different one" });
    }

    //generating random avatar
    const idx = Math.floor(Math.random() * 100) + 1; // genrate number btw 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    //generating a salt for hashing password
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

    //Creating a user in stream aswell
    try {
      console.log("users id", newUser.id);
      await upsertStreamUser({
        id: newUser.id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating a stream user", error);
    }

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

///////////////////////////////////////////////////////////////////////////////login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //checking if user email exist in database
    const user = await prisma.User.findUnique({
      where: {
        email: email,
      },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid Email or Password" });

    //comparing ented password with the one in database
    const isPasswordcorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordcorrect)
      return res.status(400).json({ message: "Invalid Email or Password" });

    //generating an jwt auth token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent xss attack,
      sameSite: "strict", //prevent CSRF attacks
      secure: process.env.NODE_ENV === "production", //prevent hrrp requests
    });

    res.status(200).json({ success: true, user: user.email });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

////////////////////////////////////////////////////////////logout
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successful" });
};

////////////////////////////////////////////////////////onboard

// export const onboard = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const { fullName, bio, nativelanguage, learningLanguage, location } =
//       req.body;

//     //updating user data
//     const updatedUser = await prisma.User.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         ...req.body,
//         isOnboarded: true,
//       },
//     });

//     if (!updatedUser)
//       return res.status(404).json({ message: "User not found" });

//     //updating stream data
//     try {
//       await upsertStreamUser({
//         id: updatedUser.id.toString(),
//         name: updatedUser.fullName,
//         image: updatedUser.profilePic || "",
//       });
//       console.log(
//         `stream user updated after onboarding for ${updatedUser.fullName}`
//       );
//     } catch (streamError) {
//       console.log(
//         "Error updating stream user during onboarding",
//         streamError.message
//       );
//     }
//     res.status(200).json({ success: true, user: updatedUser });
//   } catch (error) {
//     console.error("Error in onboarding", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import multer from "multer";
import streamifier from "streamifier";

// import cloudinary from "../config/cloudinary.js"; // adjust path

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const onboard = async (req, res) => {
  try {
    const userId = req.user.id;
    let profilePicUrl = req.body.profilePic || "";

    // If file is uploaded, send to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, uploadResult) => {
            if (error) return reject(error);
            resolve(uploadResult);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      profilePicUrl = result.secure_url;
    }

    const updatedUser = await prisma.User.update({
      where: { id: userId },
      data: {
        ...req.body,
        profilePic: profilePicUrl,
        isOnboarded: true,
      },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await upsertStreamUser({
        id: updatedUser.id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (streamError) {
      console.log("Error updating stream user", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in onboarding", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
