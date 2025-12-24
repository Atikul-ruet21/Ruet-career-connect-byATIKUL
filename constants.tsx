import { Job, User, UserRole, Application, ApplicationStatus } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Junior React Developer',
    company: 'TechSolutions Ltd',
    posterId: 'u2',
    description: 'We are looking for a passionate React developer to join our frontend team. Experience with TypeScript and Tailwind is a plus.',
    department: 'CSE',
    type: 'Remote',
    experienceLevel: 'Entry',
    salaryRange: '$60k - $80k',
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    deadline: '2023-12-31',
    postedAt: '2023-11-01'
  },
  {
    id: 'j2',
    title: 'Embedded Systems Engineer',
    company: 'IoTCore',
    posterId: 'u2',
    description: 'Design and implement firmware for our new line of smart home devices.',
    department: 'EEE',
    type: 'On-site',
    experienceLevel: 'Mid',
    salaryRange: '$70k - $90k',
    requiredSkills: ['C++', 'Microcontrollers', 'PCB Design'],
    deadline: '2023-12-15',
    postedAt: '2023-11-05'
  },
  {
    id: 'j3',
    title: 'Data Analyst Intern',
    company: 'DataFlow',
    posterId: 'u4',
    description: 'Great opportunity for students to learn big data technologies.',
    department: 'CSE',
    type: 'Hybrid',
    experienceLevel: 'Entry',
    salaryRange: '$30k - $40k',
    requiredSkills: ['Python', 'SQL', 'Excel'],
    deadline: '2024-01-20',
    postedAt: '2023-11-10'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alice Student',
    email: 'alice@ruet.ac.bd',
    role: UserRole.STUDENT,
    department: 'CSE',
    graduationYear: 2024,
    skills: ['JavaScript', 'HTML'],
    experience: 'Fresher',
    education: ['B.Sc. in CSE - RUET (2024)']
  },
  {
    id: 'u2',
    name: 'Bob Alumni',
    email: 'bob@tech.com',
    role: UserRole.ALUMNI,
    isVerified: true,
    department: 'CSE',
    graduationYear: 2018,
    education: ['B.Sc. in CSE - RUET (2018)']
  },
  {
    id: 'u3',
    name: 'Dr. Admin',
    email: 'dsw@ruet.ac.bd',
    role: UserRole.ADMIN,
    department: 'Admin'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    studentId: 'u5',
    studentName: 'Charlie Student',
    status: ApplicationStatus.APPLIED,
    appliedAt: '2023-11-12',
    aiMatchScore: 85
  },
  {
    id: 'a2',
    jobId: 'j1',
    studentId: 'u6',
    studentName: 'Dave Student',
    status: ApplicationStatus.INTERVIEW,
    appliedAt: '2023-11-10',
    aiMatchScore: 92
  }
];