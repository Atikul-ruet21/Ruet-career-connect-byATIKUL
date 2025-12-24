import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import JobCard from '../components/JobCard';
import { Search, Filter, Database, Calendar, DollarSign, Briefcase, TrendingUp } from 'lucide-react';

const JobBoard: React.FC = () => {
  const { jobs, currentUser, applications, submitApplication } = useApp();
  const [filterText, setFilterText] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDept, setFilterDept] = useState('All');
  const [filterDate, setFilterDate] = useState('All'); // '1', '7', '30'
  const [filterSalary, setFilterSalary] = useState('All'); // '30000', '50000', '80000'
  const [filterExperience, setFilterExperience] = useState('All'); // 'Entry', 'Mid', 'Senior'

  // Helper to parse salary string like "$60k - $80k" -> 60000
  const parseMinSalary = (range: string): number => {
    try {
      // Extract the first number found (assuming it's the min)
      const match = range.toLowerCase().match(/(\d+)/);
      if (!match) return 0;
      let val = parseInt(match[1]);
      // Adjust if it has 'k' (e.g., 60k) although regex above just grabs digits
      // Let's assume the string format "$60k" implies 60000.
      if (range.toLowerCase().includes('k')) {
        return val * 1000;
      }
      return val;
    } catch (e) {
      return 0;
    }
  };

  // --- Fuzzy Search Logic ---

  const getLevenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= b.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  };

  const isFuzzyMatch = (text: string, term: string): boolean => {
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    
    // 1. Direct inclusion (Fastest)
    if (lowerText.includes(lowerTerm)) return true;
    
    // 2. Token-based Fuzzy Matching
    const tokens = lowerText.split(/[\s,.-]+/);
    
    // Threshold: Allow 1 typo for words length 4-6, 2 for longer. Strict for short words.
    const threshold = lowerTerm.length < 4 ? 0 : lowerTerm.length < 7 ? 1 : 2;
    
    if (threshold === 0) return false; // Short words must match exactly (already covered by includes)

    return tokens.some(token => {
       // Optimization: Skip if length difference is too large
       if (Math.abs(token.length - lowerTerm.length) > threshold) return false;
       return getLevenshteinDistance(token, lowerTerm) <= threshold;
    });
  };

  // --------------------------

  // Simulated "Smart Search" using fuzzy matching
  const filteredJobs = jobs.filter(job => {
    // 1. Text Search (Fuzzy) - Searches title, company, description, skills
    const searchTerms = filterText.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const jobText = `${job.title} ${job.company} ${job.description} ${job.requiredSkills.join(' ')} ${job.department}`;
    
    const matchesText = searchTerms.length === 0 || searchTerms.every(term => isFuzzyMatch(jobText, term));
    
    // 2. Exact Filters
    const matchesType = filterType === 'All' || job.type === filterType;
    const matchesDept = filterDept === 'All' || job.department === filterDept;
    const matchesExperience = filterExperience === 'All' || job.experienceLevel === filterExperience;

    // 3. Date Filter
    let matchesDate = true;
    if (filterDate !== 'All') {
      const jobDate = new Date(job.postedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - jobDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      matchesDate = diffDays <= parseInt(filterDate);
    }

    // 4. Salary Filter
    let matchesSalary = true;
    if (filterSalary !== 'All') {
      const jobMinSalary = parseMinSalary(job.salaryRange);
      const filterMin = parseInt(filterSalary);
      matchesSalary = jobMinSalary >= filterMin;
    }

    return matchesText && matchesType && matchesDept && matchesDate && matchesSalary && matchesExperience;
  });

  const myApplicationIds = new Set(
    applications
      .filter(app => app.studentId === currentUser?.id)
      .map(app => app.jobId)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-2">Smart Job Board</h1>
        <p className="text-slate-600">Find your dream career with advanced filtering and AI matching.</p>
      </div>

      {/* Search and Filters Container */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 mb-8 space-y-4">
        
        {/* Top Row: Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search keywords in title, description, or skills (e.g. 'React', 'Agile')..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Bottom Row: Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Department Filter */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Briefcase size={16} className="text-slate-400" />
             </div>
             <select 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="ETE">ETE</option>
              <option value="IPE">IPE</option>
              <option value="GCE">GCE</option>
              <option value="MTE">MTE</option>
              <option value="MSE">MSE</option>
              <option value="CFPE">CFPE</option>
              <option value="BECM">BECM</option>
              <option value="ARCH">ARCH</option>
              <option value="URP">URP</option>
            </select>
          </div>

          {/* Job Type Filter */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Filter size={16} className="text-slate-400" />
             </div>
             <select 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">Any Job Type</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Experience Filter - NEW */}
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <TrendingUp size={16} className="text-slate-400" />
             </div>
             <select 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
            >
              <option value="All">Any Experience</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
            </select>
          </div>

          {/* Date Posted Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-slate-400" />
            </div>
            <select 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="All">Any Date</option>
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last Month</option>
            </select>
          </div>

          {/* Salary Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-slate-400" />
            </div>
            <select 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-sm"
              value={filterSalary}
              onChange={(e) => setFilterSalary(e.target.value)}
            >
              <option value="All">Any Salary</option>
              <option value="30000">$30k+ / year</option>
              <option value="50000">$50k+ / year</option>
              <option value="80000">$80k+ / year</option>
              <option value="100000">$100k+ / year</option>
            </select>
          </div>

        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
          <Database className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search terms or filters.</p>
          <button 
             onClick={() => {
                setFilterText('');
                setFilterType('All');
                setFilterDept('All');
                setFilterDate('All');
                setFilterSalary('All');
                setFilterExperience('All');
             }}
             className="mt-4 text-brand-600 hover:text-brand-800 font-medium text-sm"
          >
             Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              currentUser={currentUser} 
              onApply={submitApplication}
              hasApplied={myApplicationIds.has(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;