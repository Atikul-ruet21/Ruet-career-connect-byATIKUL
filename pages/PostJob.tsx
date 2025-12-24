import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, Job } from '../types';
import { Briefcase, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

interface PostJobProps {
  onCancel: () => void;
}

const PostJob: React.FC<PostJobProps> = ({ onCancel }) => {
  const { currentUser, addJob } = useApp();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    department: 'CSE',
    type: 'On-site',
    experienceLevel: 'Entry',
    salaryRange: '',
    requiredSkills: '',
    deadline: ''
  });

  // Security & Verification Check
  if (!currentUser || currentUser.role !== UserRole.ALUMNI) {
    return <div className="p-8 text-center text-red-500">Access Denied.</div>;
  }

  if (!currentUser.isVerified) {
    return (
      <div className="max-w-2xl mx-auto p-8 mt-10 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-yellow-800 mb-2">Account Not Verified</h2>
        <p className="text-yellow-700 mb-4">
          To maintain quality, only verified Alumni can post jobs. Your account is currently pending approval by the DSW Administration.
        </p>
        <button onClick={onCancel} className="text-yellow-900 underline">Back to Dashboard</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      posterId: currentUser.id,
      postedAt: new Date().toISOString().split('T')[0],
      title: formData.title,
      company: formData.company,
      description: formData.description,
      department: formData.department,
      type: formData.type as any,
      experienceLevel: formData.experienceLevel as any,
      salaryRange: formData.salaryRange,
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
      deadline: formData.deadline
    };

    addJob(newJob);
    setSuccess(true);
    setTimeout(onCancel, 2000);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-green-50 border border-green-200 rounded-lg text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-green-900">Job Posted!</h2>
        <p className="text-green-700">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-brand-900 mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-brand-900 text-white">
          <h1 className="text-xl font-bold flex items-center">
            <Briefcase className="mr-2" /> Post a New Job Opportunity
          </h1>
          <p className="text-brand-200 text-sm mt-1">Share opportunities with RUET students.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
              <input
                required
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input
                required
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
               <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
               <select
                 className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                 value={formData.department}
                 onChange={e => setFormData({...formData, department: e.target.value})}
               >
                 <option>CSE</option>
                 <option>EEE</option>
                 <option>ME</option>
                 <option>CE</option>
               </select>
            </div>
            <div className="md:col-span-1">
               <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
               <select
                 className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                 value={formData.type}
                 onChange={e => setFormData({...formData, type: e.target.value})}
               >
                 <option>On-site</option>
                 <option>Remote</option>
                 <option>Hybrid</option>
               </select>
            </div>
            <div className="md:col-span-1">
               <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
               <select
                 className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                 value={formData.experienceLevel}
                 onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
               >
                 <option>Entry</option>
                 <option>Mid</option>
                 <option>Senior</option>
               </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input
                type="date"
                required
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
               <input
                 placeholder="$50k - $70k"
                 required
                 className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                 value={formData.salaryRange}
                 onChange={e => setFormData({...formData, salaryRange: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Required Skills (comma separated)</label>
               <input
                 placeholder="React, Node.js, SQL"
                 required
                 className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                 value={formData.requiredSkills}
                 onChange={e => setFormData({...formData, requiredSkills: e.target.value})}
               />
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-brand-900 text-white px-8 py-3 rounded hover:bg-brand-800 transition font-medium"
            >
              Submit Job Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;