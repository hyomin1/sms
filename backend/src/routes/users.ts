import express from "express";
import multer from "multer";
import {
  addInform,
  googleCallback,
  googleLoginUser,
  joinUser,
  kakaoCallback,
  kakaoLoginUser,
  loginUser,
} from "../controllers/userController";
import { refreshAccessToken } from "../middleware/authenticateJWT";
import imageUpload from "../middleware/imageUploader";

const router = express.Router();
const upload = multer();
router.post("/register", imageUpload.single("file"), joinUser);
router.post("/login", loginUser);
router.post("/addInform", addInform);
router.get("/kakaoLogin", kakaoLoginUser);
router.get("/googleLogin", googleLoginUser);
router.get("/kakao/callback", kakaoCallback);
router.get("/google/callback", googleCallback);

// access_token 재발급 요청
router.post("/refresh", refreshAccessToken);

export default router;
