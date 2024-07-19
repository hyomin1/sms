import express from "express";
import {
  createStudyGroup,
  getStudyGroups,
} from "../controllers/studyGroupController";

const router = express.Router();

router.get("/", getStudyGroups);
router.post("/create", createStudyGroup);

export default router;
