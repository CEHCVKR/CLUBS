export  interface Student {
  id: string;
  name: string;
  rollNumber: string;
  year: string;
  branch: string;
  section: string;
  clubs: string[];
}

export interface User {
  username: string;
  password: string;
  role: "admin" | "coordinator";
  club: string | null;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  clubName: string;
  date: string;
  present: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  role: "admin" | "coordinator" | null;
  club: string | null;
}
 