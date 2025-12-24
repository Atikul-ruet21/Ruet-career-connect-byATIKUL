import React from 'react';
import { GraduationCap, Rocket, Users, Shield, Zap, MessageSquare, FileText, ArrowRight, BrainCircuit, Globe } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-10 w-10 text-brand-900" />
            <span className="font-bold text-2xl tracking-tight text-brand-900">RUET Career Connect</span>
          </div>
          <button 
            onClick={onGetStarted}
            className="bg-brand-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Login / Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-brand-50 -skew-y-3 origin-top-left transform translate-y-10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-sm font-medium mb-6">
            <Zap size={14} className="mr-2" /> Powered by Gemini AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-900 mb-8">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">Academic Career</span> Ecosystems
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Bridge the gap between campus and corporate. RUET Career Connect is the centralized platform connecting bright students, successful alumni, and the DSW administration.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-brand-900 text-white rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-brand-800 transition flex items-center"
            >
              Get Started Now <ArrowRight className="ml-2" />
            </button>
            <button className="px-8 py-4 bg-white text-brand-900 border border-slate-200 rounded-lg font-bold text-lg hover:bg-slate-50 transition">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Smart Features for a Smarter Future</h2>
            <p className="text-slate-500 mt-4">We use advanced AI to automate the boring stuff.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition duration-300">
              <div className="h-14 w-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit className="text-purple-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Resume Parser</h3>
              <p className="text-slate-600">
                Upload your PDF resume and let our AI automatically extract skills, education, and experience to build your profile instantly.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition duration-300">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-blue-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Job Matching</h3>
              <p className="text-slate-600">
                Don't guess. Our matching algorithm compares your skills against job descriptions to give you a "% Match Score" for every listing.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition duration-300">
              <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="text-green-600 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">ChatGuru Advisor</h3>
              <p className="text-slate-600">
                A 24/7 AI Career Advisor that helps you with interview prep, academic advice, and researches the latest industry trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tailored for Every Stakeholder</h2>
          </div>

          <div className="space-y-12">
            {/* Student */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-bold mb-4">STUDENTS</div>
                <h3 className="text-2xl font-bold mb-4">Launch Your Career</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700"><Rocket size={18} className="mr-3 text-brand-500"/> Apply to exclusive jobs posted by Alumni</li>
                  <li className="flex items-center text-slate-700"><FileText size={18} className="mr-3 text-brand-500"/> Auto-build CVs with AI</li>
                  <li className="flex items-center text-slate-700"><Globe size={18} className="mr-3 text-brand-500"/> Get real-time market insights</li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                 <div className="bg-brand-50 p-6 rounded-lg w-full max-w-sm">
                    {/* Mock Job Card UI */}
                    <div className="bg-white p-4 rounded shadow">
                       <div className="h-4 w-2/3 bg-slate-200 rounded mb-2"></div>
                       <div className="h-3 w-1/2 bg-slate-200 rounded mb-4"></div>
                       <div className="flex gap-2">
                          <div className="h-6 w-16 bg-green-100 rounded"></div>
                          <div className="h-6 w-16 bg-blue-100 rounded"></div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Alumni */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold mb-4">ALUMNI</div>
                <h3 className="text-2xl font-bold mb-4">Hire Trusted Talent</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700"><Users size={18} className="mr-3 text-blue-500"/> Post jobs directly to your department</li>
                  <li className="flex items-center text-slate-700"><Shield size={18} className="mr-3 text-blue-500"/> Verified "Alumni" badge status</li>
                  <li className="flex items-center text-slate-700"><Zap size={18} className="mr-3 text-blue-500"/> Built-in ATS (Applicant Tracking System)</li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                 <div className="bg-blue-50 p-6 rounded-lg w-full max-w-sm">
                    {/* Mock ATS UI */}
                    <div className="flex justify-between mb-2">
                       <div className="h-20 w-24 bg-white rounded shadow border-l-4 border-l-brand-500"></div>
                       <div className="h-20 w-24 bg-white rounded shadow border-l-4 border-l-purple-500"></div>
                       <div className="h-20 w-24 bg-white rounded shadow border-l-4 border-l-green-500"></div>
                    </div>
                 </div>
              </div>
            </div>

             {/* Admin */}
             <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold mb-4">ADMINISTRATION</div>
                <h3 className="text-2xl font-bold mb-4">Secure & Controlled</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700"><Shield size={18} className="mr-3 text-yellow-500"/> Verify Alumni identities</li>
                  <li className="flex items-center text-slate-700"><Users size={18} className="mr-3 text-yellow-500"/> Manage user base & content</li>
                  <li className="flex items-center text-slate-700"><Zap size={18} className="mr-3 text-yellow-500"/> Oversee placement statistics</li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                 <div className="bg-yellow-50 p-6 rounded-lg w-full max-w-sm flex items-center justify-center">
                    <Shield className="h-24 w-24 text-yellow-600 opacity-20" />
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 text-brand-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">RUET Career Connect</h2>
          <p className="text-brand-300 mb-8">Rajshahi University of Engineering & Technology</p>
          <div className="text-sm text-brand-400">
            &copy; {new Date().getFullYear()} RUET DSW. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
