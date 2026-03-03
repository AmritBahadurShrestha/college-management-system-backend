export enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LEAVE = "LEAVE",
}

export enum Program {
    BCA = 'BCA',
    BEIT = 'BE-IT',
    BECMP = 'BE-CMP',
    BECIVIL = 'BE-CIVIL',
}

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
