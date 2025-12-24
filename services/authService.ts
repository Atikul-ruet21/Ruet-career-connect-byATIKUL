import { User, Job, UserRole } from '../types';
import { MOCK_USERS, MOCK_JOBS } from '../constants';

const USERS_KEY = 'ruet_users_v1';
const JOBS_KEY = 'ruet_jobs_v1';

// Initialize localStorage with mock data if empty
const init = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(USERS_KEY)) {
      // Add passwords to mocks for testing
      const usersWithPass = MOCK_USERS.map(u => ({ ...u, password: 'password123' }));
      localStorage.setItem(USERS_KEY, JSON.stringify(usersWithPass));
    }
    if (!localStorage.getItem(JOBS_KEY)) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_JOBS));
    }
  }
};

init();

export const authService = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  saveUser: (user: User) => {
    const users = authService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) throw new Error("Invalid email or password");
    return user;
  },

  register: async (user: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = authService.getUsers();
    if (users.find(u => u.email === user.email)) {
      throw new Error("Email already registered");
    }

    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      isVerified: user.role === UserRole.STUDENT ? true : false // Alumni need admin verification
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  getJobs: (): Job[] => {
    return JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
  },

  addJob: (job: Job) => {
    const jobs = authService.getJobs();
    jobs.push(job);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }
};