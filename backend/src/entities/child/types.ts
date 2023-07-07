export interface IGetChildData {
  id: string;
}

export interface IChildData {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  actualOrExpectedBirthMonth: string;
  desiredStartingMonth: string;
  careHours: string[];
}
