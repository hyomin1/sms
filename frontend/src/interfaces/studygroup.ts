export interface IStudyGroup {
  masterId: string;
  groupName: string;
  gender: "male" | "female" | "any";
  maxCapacity: number;
  minAge: number;
  maxAge: number;
  region: string;
  isOnline: boolean;
  applicants: string[];
  members: string[];
}
