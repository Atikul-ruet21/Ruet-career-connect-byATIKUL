import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, ApplicationStatus } from '../types';
import { LayoutDashboard, Briefcase, Users, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { currentUser, applications, jobs, users } = useApp();

  if (!currentUser) return null;

  // --- Student Widgets ---
  const StudentDashboard = () => {
    const myApps = applications.filter(a => a.studentId === currentUser.id);
    const activeApps = myApps.filter(a => a.status !== ApplicationStatus.REJECTED);
    const interviews = myApps.filter(a => a.status === ApplicationStatus.INTERVIEW);
    
    // Simple recommendation logic: Jobs matching user skills
    const recommendedJobs = jobs.filter(job => {
        if (!currentUser.skills) return false;
        const hasSkill = job.requiredSkills.some(skill => currentUser.skills?.includes(skill));
        return hasSkill && !myApps.find(a => a.jobId === job.id);
    }).slice(0, 3);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Active Applications</h3>
              <FileText className="text-brand-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{activeApps.length}</p>
            <p className="text-xs text-slate-400 mt-1">Keep pushing!</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Interviews Scheduled</h3>
              <Users className="text-purple-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{interviews.length}</p>
            <p className="text-xs text-slate-400 mt-1">Prepare with ChatGuru</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Profile Strength</h3>
              <TrendingUp className="text-green-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {currentUser.skills && currentUser.skills.length > 0 ? 'Good' : 'Low'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
                {currentUser.skills ? 'Skills added' : 'Upload resume to boost'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Applications</h3>
            {myApps.length > 0 ? (
              <div className="space-y-4">
                {myApps.slice(0, 4).map(app => (
                   <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                      <div>
                        <div className="font-medium text-slate-900">{jobs.find(j => j.id === app.jobId)?.title || 'Unknown Job'}</div>
                        <div className="text-xs text-slate-500">Applied on {app.appliedAt}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium 
                        ${app.status === ApplicationStatus.INTERVIEW ? 'bg-purple-100 text-purple-800' : 
                          app.status === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-800' : 'bg-brand-100 text-brand-800'}`}>
                        {app.status}
                      </span>
                   </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                You haven't applied to any jobs yet.
                <button onClick={() => onNavigate('jobs')} className="block mx-auto mt-2 text-brand-600 hover:underline">Browse Jobs</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recommended For You</h3>
            {recommendedJobs.length > 0 ? (
              <div className="space-y-4">
                 {recommendedJobs.map(job => (
                   <div key={job.id} className="border border-slate-200 rounded-lg p-4 hover:border-brand-300 transition-colors cursor-pointer" onClick={() => onNavigate('jobs')}>
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="font-medium text-brand-900">{job.title}</div>
                            <div className="text-xs text-slate-500">{job.company} • {job.type}</div>
                         </div>
                         <ArrowRight size={16} className="text-slate-300" />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 3).map(s => (
                          <span key={s} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">{s}</span>
                        ))}
                      </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Update your skills to get AI recommendations.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- Alumni Dashboard ---
  const AlumniDashboard = () => {
    const myPostedJobs = jobs.filter(j => j.posterId === currentUser.id);
    const myJobIds = new Set(myPostedJobs.map(j => j.id));
    const totalApplicants = applications.filter(a => myJobIds.has(a.jobId)).length;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Jobs Posted</h3>
              <Briefcase className="text-brand-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{myPostedJobs.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Total Applicants</h3>
              <Users className="text-blue-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalApplicants}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Verification Status</h3>
              {currentUser.isVerified ? <CheckCircle className="text-green-500 h-5 w-5" /> : <AlertCircle className="text-yellow-500 h-5 w-5" />}
            </div>
            <p className={`text-xl font-bold ${currentUser.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              {currentUser.isVerified ? 'Verified Alumni' : 'Pending Approval'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-900">Your Active Listings</h3>
             <button onClick={() => onNavigate('post-job')} className="text-sm bg-brand-900 text-white px-3 py-1.5 rounded hover:bg-brand-800">
                + Post New Job
             </button>
          </div>
          {myPostedJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Applicants</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Posted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {myPostedJobs.map(job => {
                    const applicantCount = applications.filter(a => a.jobId === job.id).length;
                    return (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-900">{job.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{applicantCount} candidates</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.postedAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <button onClick={() => onNavigate('ats')} className="text-brand-600 hover:text-brand-900">Manage in ATS</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-10 text-slate-500">
               You haven't posted any jobs yet. Share an opportunity with RUET students!
             </div>
          )}
        </div>
      </div>
    );
  };

  // --- Admin Dashboard ---
  const AdminDashboard = () => {
    const unverifiedCount = users.filter(u => u.role === UserRole.ALUMNI && !u.isVerified).length;
    
    return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Total Users</h3>
              <Users className="text-brand-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Pending Verifications</h3>
              <AlertCircle className="text-yellow-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{unverifiedCount}</p>
            {unverifiedCount > 0 && (
              <button onClick={() => onNavigate('admin')} className="text-xs text-brand-600 mt-2 hover:underline">Review Now</button>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 text-sm font-medium">Total Jobs</h3>
              <Briefcase className="text-green-500 h-5 w-5" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{jobs.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
           <h3 className="text-xl font-bold text-brand-900 mb-2">DSW Administration Control Center</h3>
           <p className="text-slate-600 mb-6">Manage user roles, verify alumni credentials, and oversee the job ecosystem.</p>
           <button onClick={() => onNavigate('admin')} className="bg-brand-900 text-white px-6 py-3 rounded hover:bg-brand-800 transition">
             Enter Admin Panel
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-brand-900">Dashboard</h1>
           <p className="text-slate-600">Welcome back, {currentUser.name}</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded border border-slate-200">
          <Clock size={14} className="inline mr-1" />
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {currentUser.role === UserRole.STUDENT && <StudentDashboard />}
      {currentUser.role === UserRole.ALUMNI && <AlumniDashboard />}
      {currentUser.role === UserRole.ADMIN && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;