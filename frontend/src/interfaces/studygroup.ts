export interface IStudyGroup {
  _id: string;
  masterId: string;
  groupName: string;
  description: string;
  gender: "male" | "female" | "any";
  maxCapacity: number;
  ageRange: {
    min: number;
    max: number;
  };
  category: string;
  region: string;
  isOnline: boolean;
  applicants: string[];
  members: string[];
}
