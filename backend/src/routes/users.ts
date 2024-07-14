import express from "express";
import { joinUser, loginUser } from "../controllers/userController";
import { refreshAccessToken } from "../middleware/authenticateJWT";

const router = express.Router();

router.post("/join", joinUser);
router.post("/login", loginUser);
// access_token 재발급 요청
router.post("/refresh", refreshAccessToken);

export default router;
