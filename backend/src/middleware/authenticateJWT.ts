import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "";

interface IUser {
  id: string;
}

const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, { expiresIn: "1m" });
};
const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" });
};
// JWT 토큰 검증
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // access_token 분리
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
      if (err) {
        // access_token 만료, client에서 refresh이용해서 재 요청
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "토큰 만료" });
        }
        return res.status(403).json({ message: "유효하지 않은 토큰" });
      }
      next();
    });
    // 토큰 없이 요청 한경우
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
};

// refresh_token이용해서 새로운 access_token 발급

const refreshAccessToken = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    // 이 경우 다시 로그인페이지로 보내서 refresh 발급받는다.
    return res.status(400).json({ message: "Refresh token is required" });
  }
  jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const accessToken = generateAccessToken(user.id);
    res.json({ accessToken });
  });
};
export {
  generateAccessToken,
  generateRefreshToken,
  authenticateJWT,
  refreshAccessToken,
};
