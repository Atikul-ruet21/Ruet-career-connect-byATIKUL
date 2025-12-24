import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobBoard from './pages/JobBoard';
import ChatGuru from './pages/ChatGuru';
import Profile from './pages/Profile';
import ATSBoard from './pages/ATSBoard';
import AdminPanel from './pages/AdminPanel';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Auth from './components/Auth';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';

const MainLayout: React.FC = () => {
  const [page, setPage] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const { currentUser } = useApp();

  // If user is logged in, show the main app
  if (currentUser) {
    const renderPage = () => {
      switch(page) {
        case 'dashboard': return <Dashboard onNavigate={setPage} />;
        case 'jobs': return <JobBoard />;
        case 'chat': return <ChatGuru />;
        case 'profile': return <Profile />;
        case 'ats': return <ATSBoard />;
        case 'admin': return <AdminPanel />;
        case 'post-job': return <PostJob onCancel={() => setPage('dashboard')} />;
        default: return <Dashboard onNavigate={setPage} />;
      }
    };

    return (
      <div className="min-h-screen bg-brand-50">
        <Navbar onNavigate={setPage} currentPage={page} />
        <main className="container mx-auto">
          {renderPage()}
        </main>
      </div>
    );
  }

  // If not logged in, determine whether to show Landing or Auth
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  } else {
    return (
      <Auth 
        onLoginSuccess={() => setPage('dashboard')} 
        onBack={() => setShowLanding(true)}
      />
    );
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
