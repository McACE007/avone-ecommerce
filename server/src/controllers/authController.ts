import e, { Request, Response } from "express";
import { primsa } from "../server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

function generateToken(userId: string, email: string, role: string) {
  const accessToken = jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: "1year" }
  );

  const refreshToken = v4();

  return { accessToken, refreshToken };
}

export const setTokens = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await primsa.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ success: false, error: "User with this email exists!" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await primsa.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const extractCurrentUser = await primsa.user.findUnique({
      where: {
        email,
      },
    });

    if (
      !extractCurrentUser ||
      !(await bcrypt.compare(password, extractCurrentUser.password))
    ) {
      res.status(401).json({ success: false, error: "Invalid credentials" });
      return;
    }

    const { accessToken, refreshToken } = generateToken(
      extractCurrentUser.id,
      extractCurrentUser.email,
      extractCurrentUser.role
    );

    setTokens(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      user: {
        id: extractCurrentUser.id,
        email: extractCurrentUser.email,
        name: extractCurrentUser.name,
        role: extractCurrentUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
      return;
    }

    const user = await primsa.user.findUnique({
      where: {
        refreshToken,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: "User not found",
      });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      user.id,
      user.email,
      user.refreshToken!
    );

    setTokens(res, accessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Refresh token error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "User logout failed" });
  }
};
