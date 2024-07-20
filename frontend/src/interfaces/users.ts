export interface ApplicantUsers {
  _id: string;
  username: string;
  gender: "male" | "female" | "any";
  birth: Date;
  profileImg: string;
}
