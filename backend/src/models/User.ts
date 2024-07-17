import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
interface IUser {
  username: string;
  userId: string;
  password: string;
  birth: Date;
  email: string;
  gender: "male" | "female";
  profileImg?: string;
  newKakao: boolean;
}

const emailRegex =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    userId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    birth: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return new Date("1900-01-01") < v && v <= new Date();
        },
        message: () => `정확한 날짜가 아닙니다`,
      },
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      match: [emailRegex, "올바른 이메일 형식이 아닙니다."],
    },
    gender: { type: String, enum: ["male", "female"] },
    profileImg: { type: String },
  },
  {
    timestamps: true, // createAt, updateAt 필드 생성
  }
);

// save 전에 비밀번호 해시 암호화
userSchema.pre<IUser>("save", async function () {
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw new Error("비밀번호 해시 생성 에러");
  }
});

// 로그인시 입력한 비밀번호 맞는지 확인하는 함수
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("비밀번호 비교 에러");
  }
};

const User = model<IUser>("User", userSchema);
export default User;
