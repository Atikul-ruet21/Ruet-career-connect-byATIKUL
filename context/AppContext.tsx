import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Job, Application, UserRole, ApplicationStatus } from '../types';
import { db } from '../services/mockDatabase';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Data
  jobs: Job[];
  applications: Application[];
  allUsers: User[]; 
  users: User[]; // Alias for allUsers
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: User) => Promise<void>;
  
  updateUserProfile: (user: User) => void; // Persist profile changes
  
  postJob: (job: Job) => void;
  addJob: (job: Job) => void; // Alias for postJob
  
  applyToJob: (jobId: string, score: number) => void;
  submitApplication: (jobId: string, score: number) => void; // Alias for applyToJob
  
  updateAppStatus: (appId: string, status: ApplicationStatus) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void; // Alias
  
  verifyAlumni: (userId: string) => void;
  verifyUser: (userId: string) => void; // Alias for verifyAlumni
  
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const refreshData = () => {
    setJobs(db.getJobs());
    setApplications(db.getApplications());
    setAllUsers(db.getUsers());
  };

  // Initial Load
  useEffect(() => {
    refreshData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = db.getUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (newUser: User) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    db.saveUser(newUser);
    refreshData();
  };

  const updateUserProfile = (updatedUser: User) => {
    db.saveUser(updatedUser);
    setCurrentUser(updatedUser);
    refreshData();
  };

  const postJob = (job: Job) => {
    db.addJob(job);
    refreshData();
  };

  const applyToJob = (jobId: string, score: number) => {
    if (!currentUser) return;
    
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: ApplicationStatus.APPLIED,
      appliedAt: new Date().toISOString().split('T')[0],
      aiMatchScore: score
    };
    
    db.addApplication(newApp);
    refreshData();
  };

  const updateAppStatus = (appId: string, status: ApplicationStatus) => {
    db.updateApplicationStatus(appId, status);
    refreshData();
  };

  const verifyAlumni = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user && user.role === UserRole.ALUMNI) {
      const updated = { ...user, isVerified: true };
      db.saveUser(updated);
      refreshData();
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      jobs,
      applications,
      allUsers,
      users: allUsers,
      login,
      logout,
      register,
      updateUserProfile,
      postJob,
      addJob: postJob,
      applyToJob,
      submitApplication: applyToJob,
      updateAppStatus,
      updateApplicationStatus: updateAppStatus,
      verifyAlumni,
      verifyUser: verifyAlumni,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};