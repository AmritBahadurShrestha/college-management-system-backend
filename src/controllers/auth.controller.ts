import User from "../models/user.model";
import { IJWTPayload } from "../types/global.types";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import CustomError from "../middlewares/error-handler.middleware";
import { compareHash, hashPassword } from "../utils/bcrypt.utils";
import { generatePassword } from "../utils/PasswordGenerator.utils";
import { sendEmail } from "../utils/nodemailer.utils";

// Register User
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, phone, role } = req.body;
    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    // Create user
    const user: any = await User.create({
      fullName,
      email,
      password,
      phone,
      role,
    });

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    await user.save();

    const { password: pass, ...newUser } = user._doc;

    res.status(201).json({
      status: "success",
      success: true,
      data: newUser,
      message: "User registered successfully",
    });
  },
);

// Login User
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    if (!password) {
      throw new CustomError("Password is required", 400);
    }

    // Check if user exists
    const user: any = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }

    const isPassMatch = await compareHash(password, user.password ?? "");

    if (!isPassMatch) {
      throw new CustomError("Invalid credentials", 400);
    }

    // Generate auth token
    const payload: IJWTPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    // Generate JWT token
    const access_token = generateToken(payload);

    const { password: pass, ...loggedInUser } = user._doc;

    res
      .cookie("access_token", access_token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .status(200)
      .json({
        status: "success",
        success: true,
        data: {
          data: loggedInUser,
          access_token,
        },
        message: "Login successful",
      });
  },
);

// Change Password
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { old_password, new_password } = req.body;
    const isAdded = req.body?.isAdded ?? false;
    const jwtToken = req?.headers["x-access-token"];

    if (!old_password || !new_password) {
      throw new CustomError("Old password and new password are required", 400);
    }

    if (!jwtToken || typeof jwtToken !== "string")
      throw new CustomError("Invalid or missing token", 401);

    // token validate
    const userInfo = verifyToken(jwtToken);

    // check if email ready
    const user = await User.findOne({ email: userInfo?.email });
    if (!user) throw new CustomError("User not found", 400);
    // new password bcrypt hash
    const isPassMatched = compareHash(old_password, user.password);
    if (!isPassMatched) {
      throw new CustomError("Old password does not match.", 400);
    }
    user.password = await hashPassword(new_password);

    // update user (if isAdded = true )
    user.isnewAdded = isAdded;
    await user.save();

    res.status(200).json({
      status: "success",
      success: true,
      data: user,
      message: "Password updated successfully",
    });
  },
);

// Get Current Logged-in User
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    // jwt token
    const jwtToken = req?.headers["x-access-token"];
    if (!jwtToken || typeof jwtToken !== "string")
      throw new CustomError("Invalid or missing token", 401);

    // token validate error
    const userInfo = verifyToken(jwtToken);

    // check and return
    const user = await User.findById({ _id: userInfo?._id });
    if (!user) throw new CustomError("User not found", 400);

    res
      .cookie("access_token", jwtToken, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .status(200)
      .json({
        status: "success",
        success: true,
        data: user,
        message: "Current user fetched successfully",
      });
  },
);

// Logout User
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie("access_token", {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      status: "success",
      success: true,
      data: null,
      message: "Logout successful",
    });
});

// Forgot Password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("No account found with this email", 404);
    }

    const newPassword = generatePassword(12);
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.isnewAdded = true;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset - College Management System",
      html: `
      <div style="background-color:#f4f6f8;padding:30px;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.08);padding:30px;">
          <h2 style="color:#1f2937;text-align:center;margin-bottom:20px;">
            Password Reset
          </h2>
          <p style="color:#374151;font-size:14px;">
            Hello <strong>${user.fullName}</strong>,
          </p>
          <p style="color:#374151;font-size:14px;">
            Your password has been reset. Below is your new temporary password:
          </p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:15px;margin:20px 0;">
            <p style="margin:8px 0;font-size:14px;">
              <strong>Email:</strong> ${email}
            </p>
            <p style="margin:8px 0;font-size:14px;">
              <strong>New Password:</strong> ${newPassword}
            </p>
          </div>
          <p style="color:#dc2626;font-size:13px;">
            Please change your password immediately after logging in for security reasons.
          </p>
          <div style="text-align:center;margin-top:25px;">
            <a href="http://localhost:5173/login"
               style="background:#2563eb;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;display:inline-block;">
              Login Now
            </a>
          </div>
          <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="font-size:12px;color:#6b7280;text-align:center;">
            Copyright &copy; ${new Date().getFullYear()} College Management System<br/>
            This is an automated email. Please do not reply.
          </p>
        </div>
      </div>
      `,
    });

    res.status(200).json({
      status: "success",
      success: true,
      data: null,
      message: "A new password has been sent to your email",
    });
  },
);

// Change Role
export const changeRole = asyncHandler(async (req: Request, res: Response) => {
  // jwt headers
  const jwtToken = req?.headers["x-access-token"];
  const { role } = req?.body;

  if (typeof jwtToken !== "string") {
    throw new CustomError("Invalid or missing token", 401);
  }

  // validated token
  const userInfo = verifyToken(jwtToken);
  // email exist
  const isEmail = await User.findOne({ email: userInfo?.email });
  // role changed
  await User.findOneAndUpdate(
    { email: userInfo?.email },
    { role: role.toUpperCase() },
  );

  return res.status(204).json({
    status: "success",
    success: true,
    data: null,
    message: "Successful Update the Role ",
  });
});
