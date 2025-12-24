import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { LayoutDashboard, GraduationCap, Briefcase, User as UserIcon, LogOut, Settings, MessageSquare, PlusCircle, Shield } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const NavItem = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => (
    <button
      onClick={() => onNavigate(page)}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
        currentPage === page 
          ? 'bg-brand-800 text-white' 
          : 'text-brand-100 hover:bg-brand-800 hover:text-white'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <nav className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <GraduationCap className="h-8 w-8 text-brand-200" />
            <span className="font-bold text-xl tracking-tight">RUET Career Connect</span>
          </div>

          {currentUser && (
            <div className="hidden md:flex items-center space-x-4">
              <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem page="jobs" icon={Briefcase} label="Jobs" />
              
              {currentUser.role === UserRole.STUDENT && (
                <>
                  <NavItem page="chat" icon={MessageSquare} label="ChatGuru" />
                  <NavItem page="profile" icon={UserIcon} label="Profile" />
                </>
              )}

              {currentUser.role === UserRole.ALUMNI && (
                <>
                  <NavItem page="post-job" icon={PlusCircle} label="Post Job" />
                  <NavItem page="ats" icon={Settings} label="ATS Board" />
                </>
              )}

              {currentUser.role === UserRole.ADMIN && (
                <NavItem page="admin" icon={Shield} label="Admin Panel" />
              )}
              
              <div className="pl-4 ml-4 border-l border-brand-700 flex items-center space-x-3">
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-sm font-medium">{currentUser.name}</span>
                    {currentUser.role === UserRole.ALUMNI && (
                      <span className={`w-2 h-2 rounded-full ${currentUser.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`} title={currentUser.isVerified ? 'Verified' : 'Pending Verification'} />
                    )}
                  </div>
                  <span className="text-xs text-brand-300 capitalize">{currentUser.role.toLowerCase()}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-brand-800 transition-colors text-brand-200 hover:text-white"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;