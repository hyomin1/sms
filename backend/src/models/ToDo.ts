import mongoose, { Schema } from "mongoose";

interface INotification {
  content: string;
  createdAt: Date;
}

interface IToDo {
  studyGroupId: mongoose.Types.ObjectId;
  notifications: INotification[];
}
const notificationSchema = new Schema<INotification>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const todoSchema = new Schema<IToDo>({
  studyGroupId: {
    type: Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  notifications: [notificationSchema],
});

const ToDo = mongoose.model<IToDo>("ToDo", todoSchema);
export default ToDo;
