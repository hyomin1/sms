import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY || "";

// access_token 생성
const generateAccessToken = (userId: ObjectId) => {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, { expiresIn: "1h" });
};

// refresh_token 생성
const generateRefreshToken = (userId: ObjectId) => {
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" });
};

// JWT 토큰 검증
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // access_token 분리
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, user: any) => {
      if (err) {
        // access_token 만료, client에서 refresh이용해서 재 요청
        if (err.name === "TokenExpiredError") {
          console.error("여긴가");
          return refreshAccessToken(req, res);
          //return res.status(401).json({ message: "토큰 만료" });
        }
        return res.status(403).json({ message: "유효하지 않은 토큰" });
      }

      req.body.id = ObjectId.createFromHexString(user.id);
      next();
    });
    // 토큰 없이 요청 한경우
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
};

// refresh_token이용해서 새로운 access_token 발급
const refreshAccessToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    // 이 경우 다시 로그인페이지로 보내서 refresh 발급받는다.
    return res.status(401).json({
      message: "리프레시 토큰이 존재하지 않습니다. 다시 로그인 해주세요.",
    });
  }
  jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY, (err: any, user: any) => {
    if (err) {
      // 접근 권한 없다고 처리하기
      if (err.name === "TokenExpiredError") {
        // 이 경우 다시 로그인페이지로 보내서 refresh 발급받는다.
        return res
          .status(401)
          .json({ message: "리프레시 토큰이 만료되었습니다." });
      }
      return res.status(403).json({ message: "리프레시 토큰이 유효하지 않음" });
    }

    // 토큰 만료시 클라이언트에서 다시 발급받고 요청보내는 로직필요함
    const accessToken = generateAccessToken(user.id);
    res.json({ accessToken, message: "새로운 액세스 토큰 발급" });
  });
};
export {
  generateAccessToken,
  generateRefreshToken,
  authenticateJWT,
  refreshAccessToken,
};
