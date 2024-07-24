import mongoose, { model, ObjectId, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

// category : string배열로 바꾸기, 지금은 임시용
interface IStudyGroup {
  masterId: mongoose.Types.ObjectId;
  chatRoomId: mongoose.Types.ObjectId;
  groupName: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  applicants: mongoose.Types.ObjectId[];
  category: string;
  maxCapacity: number;
  isOnline: boolean;
  ageRange: {
    min: number;
    max: number;
  };
  region: string;
  gender: "남성" | "여성" | "성별 무관";
}

const studyGroupSchema = new Schema<IStudyGroup>({
  masterId: { type: ObjectId, ref: "User", required: true },
  groupName: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: ObjectId, ref: "User" }],
  applicants: [{ type: ObjectId, ref: "User" }],
  category: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  isOnline: { type: Boolean, default: false },
  ageRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  region: { type: String, required: true },
  gender: { type: String, enum: ["남성", "여성", "성별 무관"], required: true },
});

const StudyGroup = model<IStudyGroup>("StudyGroup", studyGroupSchema);
export default StudyGroup;
