import express from "express";
import {
  createStudyGroup,
  getStudyGroups,
  searchGroup,
} from "../controllers/studyGroupController";

const router = express.Router();

router.get("/", getStudyGroups);
router.post("/create", createStudyGroup);
router.post("/search", searchGroup);

export default router;
