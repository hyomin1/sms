import mongoose, { model, ObjectId, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

interface IStudyGroup {
  masterId: mongoose.Types.ObjectId;
  chatRoomId: mongoose.Types.ObjectId;
  groupName: string;
  members: mongoose.Types.ObjectId[];
  applicants: mongoose.Types.ObjectId[];
  category: string[];
  maxCapacity: number;
  isOnline: boolean;
  minAge: number;
  maxAge: number;
  region: string;
  gender: "male" | "female | any";
  calendarId: mongoose.Types.ObjectId[];
}

const studyGroupSchema = new Schema<IStudyGroup>({
  masterId: { type: ObjectId, ref: "User", required: true },
  groupName: { type: String, required: true },
  members: [{ type: ObjectId, ref: "User" }],
  applicants: [{ type: ObjectId, ref: "User" }],
  category: [{ type: String, required: true }],
  maxCapacity: { type: Number, required: true },
  isOnline: { type: Boolean, default: false },
  minAge: { type: Number },
  maxAge: { type: Number },
  region: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "any"], required: true },

  //   calendarId: [{ type: ObjectId, ref: "Calendar" }],
  //   chatRoomId: [{ type: ObjectId, ref: "ChatRoom"}],
});

const StudyGroup = model<IStudyGroup>("StudyGroup", studyGroupSchema);
export default StudyGroup;
