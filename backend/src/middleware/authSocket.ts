import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
  };
}

export const authenticateSocket = (
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error : Token missing"));
  }

  jwt.verify(token, JWT_SECRET_KEY, (err: any, user: any) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new Error("Authentication error : Token expired"));
      }
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = user;
    next();
  });
};
