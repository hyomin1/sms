import express from "express";
import { createStudyGroup } from "../controllers/studyGroupController";
import { authenticateJWT } from "../middleware/authenticateJWT";

const router = express.Router();

router.post("/create", authenticateJWT, createStudyGroup);

export default router;
