import React, { useState, useEffect } from 'react';
import { Job, User, UserRole } from '../types';
import { Briefcase, MapPin, Calendar, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import { getJobMatchScore } from '../services/geminiService';

interface JobCardProps {
  job: Job;
  currentUser: User | null;
  onApply: (jobId: string, score: number) => void;
  hasApplied: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, currentUser, onApply, hasApplied }) => {
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);

  useEffect(() => {
    // Only fetch match score for students who haven't applied yet
    if (currentUser?.role === UserRole.STUDENT && !hasApplied && !matchScore && currentUser.skills) {
      const fetchScore = async () => {
        setLoadingScore(true);
        const profileStr = `Skills: ${currentUser.skills?.join(', ')}. Experience: ${currentUser.experience}`;
        const jobStr = `Title: ${job.title}. Desc: ${job.description}. Required: ${job.requiredSkills.join(', ')}`;
        const score = await getJobMatchScore(profileStr, jobStr);
        setMatchScore(score);
        setLoadingScore(false);
      };
      fetchScore();
    }
  }, [currentUser, job, hasApplied, matchScore]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-brand-900">{job.title}</h3>
          <p className="text-brand-600 font-medium">{job.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.type === 'Remote' ? 'bg-green-100 text-green-800' :
            job.type === 'On-site' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {job.type}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {job.experienceLevel}
          </span>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.requiredSkills.map(skill => (
          <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center text-slate-500 text-xs space-x-4 mb-6">
        <div className="flex items-center">
          <MapPin size={14} className="mr-1" />
          {job.department}
        </div>
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          {job.deadline}
        </div>
        <div className="flex items-center font-medium text-brand-700">
          {job.salaryRange}
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-4">
        <div className="flex items-center">
          {currentUser?.role === UserRole.STUDENT && (
             loadingScore ? (
               <span className="text-xs text-slate-400 flex items-center">
                 <Zap size={12} className="mr-1 animate-pulse" /> AI Matching...
               </span>
             ) : matchScore !== null ? (
               <span className={`text-xs font-bold flex items-center ${
                 matchScore > 80 ? 'text-green-600' : matchScore > 50 ? 'text-yellow-600' : 'text-slate-400'
               }`}>
                 <Zap size={12} className="mr-1" /> {matchScore}% Match
               </span>
             ) : null
          )}
        </div>

        {currentUser?.role === UserRole.STUDENT ? (
          hasApplied ? (
            <button disabled className="flex items-center text-green-600 text-sm font-medium cursor-default">
              <CheckCircle size={16} className="mr-1" /> Applied
            </button>
          ) : (
            <button 
              onClick={() => onApply(job.id, matchScore || 0)}
              className="bg-brand-900 text-white px-4 py-2 rounded text-sm hover:bg-brand-800 transition"
            >
              Apply Now
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default JobCard;