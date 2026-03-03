import User from "../models/user.model";
import { Role } from "../types/enum.types";
import { verifyToken } from "../utils/jwt.utils";
import CustomError from "./error-handler.middleware";
import { NextFunction, Request, Response } from "express";

export const authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const access_token = req.headers["x-access-token"];

      // Validate token exists
      if (!access_token || typeof access_token !== "string") {
        throw new CustomError("Token is missing ", 401);
      }

      // Verify token
      const decodedData = verifyToken(access_token);

      // Find user
      const user = await User.findById(decodedData._id);

      if (!user) {
        throw new CustomError("User is not found ", 401);
      }

      // Check role authorization
      if (roles && !roles.includes(decodedData.role)) {
        throw new CustomError("Role is Unauthorized", 403);
      }

      // Attach user to request
      req.user = {
        _id: decodedData._id,
        role: decodedData.role,
        email: decodedData.email,
        fullName: decodedData.fullName,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
