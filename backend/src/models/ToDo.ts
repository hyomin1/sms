import mongoose, { Schema } from "mongoose";

interface IPost {
  content: string;
  createdAt: Date;
}

interface IToDo {
  studyGroupId: mongoose.Types.ObjectId;
  notifications: IPost[];
  checkLists: IPost[];
}
const postSchema = new Schema<IPost>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const todoSchema = new Schema<IToDo>({
  studyGroupId: {
    type: Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  notifications: [postSchema],
  checkLists: [postSchema],
});

const ToDo = mongoose.model<IToDo>("ToDo", todoSchema);
export default ToDo;
