import mongoose, { model, ObjectId, Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

interface IMessage {
  senderName: String;
  content: string;
  createdAt: Date;
  profile: string;
  userId: string;
}

interface IChat {
  studyGroupId: mongoose.Types.ObjectId;
  messages: IMessage[];
  members: mongoose.Types.ObjectId[];
  lastActivity: Date;
}

const messageSchema = new Schema<IMessage>({
  senderName: { type: String, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profile: { type: String, required: true },
  userId: { type: String, required: true },
});

const chatSchema = new Schema<IChat>(
  {
    studyGroupId: {
      type: Schema.Types.ObjectId,
      ref: "StudyGroup",
      required: true,
    },
    messages: [messageSchema],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lastActivity: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// 인덱스 설정
chatSchema.index({ studyGroupId: 1 });
chatSchema.index({ lastActivity: -1 });

// TTL 인덱스 설정 (옵션): 30일 후 메시지 자동 삭제
messageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
