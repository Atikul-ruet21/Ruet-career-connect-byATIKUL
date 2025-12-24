import { User, Job, Application, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'rcc_users_db',
  JOBS: 'rcc_jobs_db',
  APPLICATIONS: 'rcc_applications_db'
};

class MockDatabase {
  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    
    if (!existingUsers) {
      console.log('🌱 Seeding Database...');
      this.seedData();
    }
  }

  private seedData() {
    const adminUser: User = {
      id: 'admin-1',
      name: 'Dr. Admin',
      email: 'admin@ruet.ac.bd',
      password: '123',
      role: UserRole.ADMIN,
      department: 'DSW'
    };

    const alumniUser: User = {
      id: 'alumni-1',
      name: 'Bob Engineer',
      email: 'alumni@tech.com',
      password: '123',
      role: UserRole.ALUMNI,
      department: 'CSE',
      isVerified: true
    };

    const studentUser: User = {
      id: 'student-1',
      name: 'Alice Student',
      email: 'student@ruet.ac.bd',
      password: '123',
      role: UserRole.STUDENT,
      department: 'CSE',
      // Flattened properties
      skills: ['React', 'TypeScript'],
      education: ['B.Sc. CSE, RUET (2024)'],
      experience: 'Fresher'
    };

    const jobs: Job[] = [
      {
        id: 'job-1',
        title: 'Junior Frontend Developer',
        company: 'TechSolutions BD',
        description: 'We are looking for a React developer.',
        department: 'CSE',
        posterId: 'alumni-1',
        postedAt: new Date().toISOString().split('T')[0],
        deadline: '2024-12-31',
        type: 'Remote',
        salaryRange: '50k - 70k BDT',
        // New required fields
        experienceLevel: 'Entry',
        requiredSkills: ['React', 'TypeScript', 'Frontend'],
        tags: ['React', 'TypeScript', 'Frontend'],
        applicants: []
      },
      {
        id: 'job-2',
        title: 'IoT Engineer Intern',
        company: 'SmartHome Ltd',
        description: 'Firmware development internship.',
        department: 'EEE',
        posterId: 'alumni-1',
        postedAt: new Date().toISOString().split('T')[0],
        deadline: '2024-11-30',
        type: 'On-site',
        salaryRange: '20k - 30k BDT',
        // New required fields
        experienceLevel: 'Entry',
        requiredSkills: ['C++', 'Arduino', 'IoT'],
        tags: ['C++', 'Arduino', 'IoT'],
        applicants: []
      }
    ];

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([adminUser, alumniUser, studentUser]));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
  }

  // --- User Operations ---
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // --- Job Operations ---
  getJobs(): Job[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOBS) || '[]');
  }

  addJob(job: Job): void {
    const jobs = this.getJobs();
    jobs.push(job);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }

  updateJob(updatedJob: Job): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === updatedJob.id);
    if (index !== -1) {
      jobs[index] = updatedJob;
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }
  }

  // --- Application Operations ---
  getApplications(): Application[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
  }

  addApplication(app: Application): void {
    const apps = this.getApplications();
    apps.push(app);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Also update the job's applicant list
    const jobs = this.getJobs();
    const jobIndex = jobs.findIndex(j => j.id === app.jobId);
    if (jobIndex !== -1) {
      if (!jobs[jobIndex].applicants) jobs[jobIndex].applicants = [];
      if (!jobs[jobIndex].applicants.includes(app.studentId)) {
        jobs[jobIndex].applicants.push(app.studentId);
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      }
    }
  }

  updateApplicationStatus(appId: string, status: Application['status']): void {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === appId);
    if (index !== -1) {
      apps[index].status = status;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    }
  }
}

export const db = new MockDatabase();