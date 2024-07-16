import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY || "",
  },
  region: "ap-northeast-2",
});

const imageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "image-sms",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, callback) => {
      callback(null, `${uuidv4()}_${file.originalname}`);
    },
    acl: "public-read",
  }),
});

export default imageUpload;
