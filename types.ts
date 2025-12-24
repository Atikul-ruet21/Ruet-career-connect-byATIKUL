export enum UserRole {
  STUDENT = 'STUDENT',
  ALUMNI = 'ALUMNI',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  HIRED = 'HIRED'
}

export interface UserProfile {
  skills: string[];
  education: string[];
  experience?: string;
  resumeUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock auth simulation
  role: UserRole;
  department?: string;
  
  // Flattened Role-specific fields
  isVerified?: boolean; // Required for Alumni
  graduationYear?: number;
  
  // Student Profile fields
  skills?: string[];
  education?: string[];
  experience?: string;
  resumeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  department: string;
  posterId: string; // Renamed from postedBy to match usage
  postedAt: string;
  deadline: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  salaryRange: string;
  
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  requiredSkills: string[];
  
  tags?: string[]; // Skills/Keywords
  applicants?: string[]; // Array of Student IDs who applied
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName?: string;
  status: ApplicationStatus;
  appliedAt: string;
  aiMatchScore: number; // 0-100
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  sources?: { uri: string; title: string }[];
}