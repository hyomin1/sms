import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/authenticateJWT";
import axios from "axios";

interface MulterS3File extends Express.Multer.File {
  location: string;
}

const defaultImg =
  "https://image-sms.s3.ap-northeast-2.amazonaws.com/defaultProfileImg.png";

export const joinUser = async (req: Request, res: Response) => {
  try {
    //회원가입시 사진 선택
    if (req.file) {
      const file = req.file as MulterS3File;
      await User.create({
        ...req.body,
        profileImg: file.location,
      });
      return res.status(201).json({ message: "회원가입 성공" });
    } // 사진 선택 안한 경우
    else {
      console.log(req.body);
      await User.create({
        ...req.body,
        profileImg: defaultImg,
      });
      return res.status(201).json({ message: "회원가입 성공" });
    }
    // const newUser = new User(req.body);
    //await newUser.save(); // save하면서 유효성 검사
    //return res.status(201).json(newUser);
  } catch (error: any) {
    // 중복 키 에러 코드
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const errMsg =
        field === "email"
          ? "이미 사용중인 이메일 입니다."
          : "이미 사용중인 아이디 입니다.";
      res.status(400).json({ message: errMsg });
    } else {
      // field로 email, birth 구분해서 에러 나누기
      const field = Object.keys(error.errors)[0];
      return res.status(400).json({ message: error.message });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { userId, password } = req.body;
  try {
    if (userId.length === 0 || password.length === 0) {
      return res
        .status(400)
        .json({ message: "아이디나 비밀번호를 입력해주세요" });
    }
    // if (!userId || !password) {
    //   res
    //     .status(400)
    //     .json({ message: "아이디와 비밀번호를 모두 입력해주세요" });
    // }

    // 유저 아이디로 DB에서 유저 찾기
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 아이디입니다." });
    }

    // 비밀번호 일치 여부
    const userPassword = user?.password || "";
    const isMatch = await bcrypt.compare(password, userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    const access_token = generateAccessToken(userId);
    const refresh_token = generateRefreshToken(userId);
    // refreshToken 쿠키로 발급
    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      sameSite: "strict", // CSRF 공격방지
      //secure:true, // HTTPS에서만 사용하도록 설정(배포 시)
    });

    return res.status(201).json({ message: "로그인 성공", access_token });
  } catch (error) {
    return res.status(500).json({ message: "에러" });
  }
};

const kakaoOpt = {
  clientId: process.env.KAKAO_CLIENT_ID || "",
  clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
  redirectUri: process.env.KAKAO_REDIRECT_URI || "",
};

export const kakaoLoginUser = (req: Request, res: Response) => {
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOpt.clientId}&redirect_uri=${kakaoOpt.redirectUri}&response_type=code`;
  res.redirect(kakaoLoginURL);
};

export const kakaoCallback = async (req: Request, res: Response) => {
  try {
    const tokenUrl = `https://kauth.kakao.com/oauth/token`;
    const res = await axios.post(tokenUrl, null, {
      params: {
        grant_type: "authorization_code",
        client_id: kakaoOpt.clientId,
        client_secret: kakaoOpt.clientSecret,
        redirectUri: kakaoOpt.redirectUri,
        code: req.query.code,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const userUrl = `https://kapi.kakao.com/v2/user/me`;
    const Header = {
      headers: {
        Authorization: `Bearer ${res.data.access_token}`,
      },
    };
    const res2 = await axios.get(userUrl, Header);
    // 카카오 로그인 성공했을때
    if (res2.status === 200) {
      const userId = res2.data.id;
      const { nickname: username, profile_image: profileImg } =
        res2.data.properties;
      const isNew = successKakaoLogin(userId, username, profileImg);
    }
  } catch (error) {
    console.error(error);
  }
};

const successKakaoLogin = async (
  userId: string,
  username: string,
  profileImg: string
) => {
  const user = await User.findOne({ userId });
  // 카카오 로그인이 처음인 경우(db에 정보 저장후, 추가 정보 받게)
  if (!user) {
    await User.create({
      userId,
      username,
      profileImg,
    });
    return true;
  } else {
    return false;
  }
};

export const googleLoginUser = (req: Request, res: Response) => {};
