import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    name: string;
    email: string;
    role: "USER" | "SUPER_ADMIN";
  };
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      res
        .status(401)
        .json({ success: false, error: "Access token is not present" });
      return;
    }

    const payload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET!
    ) as JwtPayload & {
      userId: string;
      name: string;
      email: string;
      role: "USER" | "SUPER_ADMIN";
    };

    req.user = {
      userId: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ success: false, error: "Access token is not present" });
  }
};

export const isSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "SUPER_ADMIN") next();
  else {
    res.status(403).json({
      success: false,
      error: "Access denied! Super admin access required",
    });
  }
};
