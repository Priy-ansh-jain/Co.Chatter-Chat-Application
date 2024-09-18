import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js"; // Ensure the path is correct
import { renameSync, unlinkSync } from "fs";
const tokenExpire = 3 * 24 * 60 * 60; // Token expiration in seconds (3 days)

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: tokenExpire,
  });
};

export const signup = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge: tokenExpire * 1000, // Convert seconds to milliseconds
      httpOnly: true, // Added for security
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge: tokenExpire * 1000, // Convert seconds to milliseconds
      httpOnly: true, // Added for security
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).send("Please provide all required fields");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No image provided" });
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;

    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.image) {
      unlinkSync(user.image);
    }
    user.image = null;
    await user.save();

    return res
      .status(200)
      .send({ message: "Profile image removed successfully." });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    console.log("Logging out user...");
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1,
    });
    console.log("Cookie cleared.");
    return res.status(200).send({ message: "Logout successful." });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(400).send({ message: error.message });
  }
};
