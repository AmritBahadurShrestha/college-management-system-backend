import { IJWTPayload } from "./global.types";

declare global {
  namespace Express {
    interface Request {
      user: IJWTPayload;
    }
  }
}
export {};
