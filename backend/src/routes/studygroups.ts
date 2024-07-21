import express from "express";
import {
  acceptGroupUser,
  createStudyGroup,
  denyGroupUser,
  getStudyGroup,
  getStudyGroups,
  joinStudyGroup,
  manageGroup,
  searchGroup,
} from "../controllers/studyGroupController";

const router = express.Router();

router.get("/", getStudyGroups);
router.get("/:groupId", getStudyGroup);

router.post("/manage", manageGroup);
router.post("/create", createStudyGroup);
router.post("/search", searchGroup);
router.post("/join", joinStudyGroup);
router.post("/accept", acceptGroupUser);
router.post("/deny", denyGroupUser);

export default router;
