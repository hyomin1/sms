import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/authenticateJWT";
import axios from "axios";
interface MulterS3File extends Express.Multer.File {
  location: string;
}

// 이미지 설정 안한 경우
const defaultImg =
  "https://image-sms.s3.ap-northeast-2.amazonaws.com/defaultProfileImg.png";

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    //secure: true, // HTTPS에서만 사용하도록 설정(배포 시)
  });
};

export const joinUser = async (req: Request, res: Response) => {
  try {
    //회원가입시 사진 선택
    const profileImg = req.file
      ? (req.file as MulterS3File).location
      : defaultImg;

    await User.create({
      ...req.body,
      profileImg,
    });

    return res.status(201).json({ message: "회원가입 성공" });
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
    if (!userId || !password) {
      return res
        .status(400)
        .json({ message: "아이디나 비밀번호를 입력해주세요" });
    }

    // 유저 아이디로 DB에서 유저 찾기
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 아이디입니다." });
    }

    // 비밀번호 일치 여부
    const userPassword = user?.password || "";
    const user_Id = user?._id || "";

    const isMatch = await bcrypt.compare(password, userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    const access_token = generateAccessToken(user_Id);
    const refresh_token = generateRefreshToken(user_Id);

    // refreshToken 쿠키로 발급
    setRefreshTokenCookie(res, refresh_token);

    return res
      .status(201)
      .json({ message: "로그인 성공", _id: user._id, access_token });
  } catch (error) {
    return res.status(500).json({ message: "로그인 처리 중 서버 오류" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const user = await User.findOne({ _id: id }).select(
      "username gender birth profileImg email createdAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "해당 유저가 존재하지 않습니다." });
    }
    res.status(200).json({ message: "유저 정보 조회 성공", user });
  } catch (error) {
    console.error("유저 정보 조회 중 에러", error);
    res.status(500).json({ message: "유저 정보 조회 실패" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const { memberIds } = req.body;
  try {
    const users = await User.find({ _id: memberIds }).select(
      "username gender birth profileImg"
    );

    res.json({ message: "유저 정보 조회 성공", users });
  } catch (error) {
    console.error("유저 정보 조회 중 에러", error);
    res.status(500).json({ message: "유저 정보 조회 실패" });
  }
};

const kakaoOpt = {
  clientId: process.env.KAKAO_CLIENT_ID || "",
  clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
  redirectUri: process.env.KAKAO_REDIRECT_URI || "",
};
const googleOpt = {
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: process.env.GOOGLE_REDIRECT_URI || "",
};

// 소셜 로그인 성공 시
const successSocialLogin = async (
  userId: string,
  username: string,
  profileImg: string,
  res: Response
) => {
  let baseUrl = `http://localhost:3000/socialLogin?isNew=`;
  const user = await User.findOne({ userId });
  // 카카오 로그인이 처음인 경우(db에 정보 저장후, 추가 정보 받게)
  if (!user) {
    baseUrl += `${true}&userId=${userId}&username=${username}&profileImg=${profileImg}`;
  } else {
    const user_Id = user?._id || "";
    const access_token = generateAccessToken(user_Id);
    const state = encodeURIComponent(JSON.stringify({ access_token }));
    const refresh_token = generateRefreshToken(user_Id);

    setRefreshTokenCookie(res, refresh_token);

    baseUrl += `${false}&state=${state}`;
  }
  return baseUrl;
};

export const kakaoLoginUser = (req: Request, res: Response) => {
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoOpt.clientId}&redirect_uri=${kakaoOpt.redirectUri}&response_type=code`;
  res.redirect(kakaoLoginURL);
};

export const kakaoCallback = async (req: Request, res: Response) => {
  try {
    const tokenUrl = `https://kauth.kakao.com/oauth/token`;
    const tokenResponse = await axios.post(tokenUrl, null, {
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
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    };
    const userResponse = await axios.get(userUrl, Header);
    // 카카오 로그인 성공했을때
    if (userResponse.status === 200) {
      const userId = userResponse.data.id;
      const { nickname: username, profile_image: profileImg } =
        userResponse.data.properties;
      const url = await successSocialLogin(userId, username, profileImg, res);
      res.redirect(url);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "카카오 로그인 처리 중 오류 발생" });
  }
};

export const googleLoginUser = (req: Request, res: Response) => {
  const googleLoginURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleOpt.clientId}&redirect_uri=${googleOpt.redirectUri}&response_type=code&scope=email profile`;
  res.redirect(googleLoginURL);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const tokenUrl = `https://oauth2.googleapis.com/token`;
    const tokenResponse = await axios.post(tokenUrl, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const userUrl = `https://www.googleapis.com/oauth2/v2/userinfo`;
    const Header = {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    };
    const userResponse = await axios.get(userUrl, Header);
    // 구글 로그인 성공 시
    if (userResponse.status === 200) {
      const {
        id: userId,
        name: username,
        picture: profileImg,
      } = userResponse.data;
      const url = await successSocialLogin(userId, username, profileImg, res);
      res.redirect(url);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "구글 로그인 처리 중 오류 발생" });
  }
};

// 소셜 로그인시 추가 정보 작성하기 위함
export const addInform = async (req: Request, res: Response) => {
  try {
    const randomPw = crypto.randomBytes(12).toString("base64").slice(0, 12);
    const password = await bcrypt.hash(randomPw, 10);

    const user = await User.create({
      ...req.body,
      password,
    });
    const user_Id = user?._id || "";

    const access_token = generateAccessToken(user_Id);
    const refresh_token = generateRefreshToken(user_Id);

    setRefreshTokenCookie(res, refresh_token);

    return res.json({ message: "추가 정보 작성 완료", access_token });
  } catch (error) {
    return res.status(500).json({ message: "서버 오류" });
  }
};
