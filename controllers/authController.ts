import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_TOKEN as string,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user: any) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const isEmailAllReadyExist = await User.findOne({ email });
    if (isEmailAllReadyExist) {
      return res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = req.body;
    const { email, password } = user;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = isUserExist.password === password;

    if (!isPasswordMatched) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "wrong password",
      });
    }

    const accessToken = generateAccessToken(isUserExist);
    const refreshToken = generateRefreshToken(isUserExist);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Login success",
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      message: error.message.toString(),
    });
  }
};

const validateToken = (req: Request, res: Response) => {
  res.status(200).json({ valid: true });
};

const refreshToken = (req: Request, res: Response) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    const newAccessToken = generateAccessToken(decoded);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Invalid refresh token", error: error.message });
  }
};

export { register, login, validateToken, refreshToken };
