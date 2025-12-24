import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileText, Check, AlertCircle, Loader2, GraduationCap, Mail } from 'lucide-react';
import { parseResumeWithAI } from '../services/geminiService';
import { UserRole } from '../types';

const Profile: React.FC = () => {
  const { currentUser, updateUserProfile } = useApp();
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!currentUser) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type (PDF or Text)
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      setError("Please upload a PDF or Text file.");
      return;
    }

    setParsing(true);
    setError(null);
    setSuccess(false);

    try {
      // Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result?.toString().split(',')[1];
        if (base64Data) {
          const extractedData = await parseResumeWithAI(base64Data, file.type);
          
          // Update user profile with extracted data AND persist it
          updateUserProfile({
            ...currentUser,
            skills: extractedData.skills || currentUser.skills,
            experience: extractedData.experience || currentUser.experience,
            education: extractedData.education || currentUser.education,
            resumeUrl: file.name
          });
          setSuccess(true);
        }
      };
    } catch (err) {
      setError("Failed to parse resume. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  const handleResendVerification = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-900">My Profile</h1>
        {currentUser.role === UserRole.ALUMNI && !currentUser.isVerified && (
           <div className="flex items-center space-x-2">
             <span className="text-xs text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded">Unverified</span>
             <button 
               onClick={handleResendVerification}
               disabled={emailSent}
               className="text-xs text-brand-600 hover:underline flex items-center"
             >
               {emailSent ? <span className="text-green-600 flex items-center"><Check size={12} className="mr-1"/> Sent!</span> : 'Resend Verification Email'}
             </button>
           </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-brand-50">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-brand-200 rounded-full flex items-center justify-center text-brand-700 font-bold text-2xl">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-900">{currentUser.name}</h2>
              <p className="text-brand-600">{currentUser.department} • Class of {currentUser.graduationYear}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Resume Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-brand-900 mb-2">Resume & Skills</h3>
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              {currentUser.resumeUrl ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-10 w-10 text-brand-500 mb-2" />
                  <p className="font-medium text-slate-700">{currentUser.resumeUrl}</p>
                  <p className="text-xs text-slate-500 mt-1">Uploaded successfully</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-10 w-10 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    Upload your resume (PDF) to auto-fill skills, experience & education
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-brand-50 file:text-brand-700
                      hover:file:bg-brand-100
                      mx-auto max-w-xs
                    "
                    disabled={parsing}
                  />
                </div>
              )}
              
              {parsing && (
                 <div className="mt-4 flex items-center justify-center text-sm text-brand-600">
                   <Loader2 className="animate-spin mr-2" size={16} /> Parsing with Gemini AI...
                 </div>
              )}
              
              {error && (
                <div className="mt-4 flex items-center justify-center text-sm text-red-600">
                  <AlertCircle size={16} className="mr-1" /> {error}
                </div>
              )}

              {success && (
                <div className="mt-4 flex items-center justify-center text-sm text-green-600">
                  <Check size={16} className="mr-1" /> Profile updated from Resume!
                </div>
              )}
            </div>
          </div>

          {/* Parsed Data Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Skills</label>
              <div className="min-h-[120px] p-3 border border-slate-300 rounded-md bg-white">
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills && currentUser.skills.length > 0 ? (
                    currentUser.skills.map((skill, idx) => (
                      <span key={idx} className="bg-brand-100 text-brand-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">No skills found.</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience Summary</label>
              <textarea
                className="w-full min-h-[120px] p-3 border border-slate-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
                value={currentUser.experience || ''}
                readOnly
                placeholder="Professional experience extracted from resume..."
              />
            </div>
          </div>

          {/* Education Section */}
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Education History</label>
             <div className="w-full min-h-[80px] p-3 border border-slate-300 rounded-md bg-white">
                {currentUser.education && currentUser.education.length > 0 ? (
                  <ul className="space-y-2">
                    {currentUser.education.map((edu, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-700">
                         <GraduationCap size={16} className="text-brand-400 mr-2 flex-shrink-0" />
                         {edu}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-slate-400 text-sm">No education history found.</span>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;