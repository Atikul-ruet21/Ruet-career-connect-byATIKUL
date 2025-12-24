import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { CheckCircle, XCircle, ShieldCheck, Mail, Briefcase } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { users, verifyUser, currentUser } = useApp();

  // Security Check
  if (currentUser?.role !== UserRole.ADMIN) {
    return <div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>;
  }

  const unverifiedAlumni = users.filter(u => u.role === UserRole.ALUMNI && !u.isVerified);
  const verifiedAlumni = users.filter(u => u.role === UserRole.ALUMNI && u.isVerified);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-900 mb-2 flex items-center">
          <ShieldCheck className="mr-2" /> DSW Admin Panel
        </h1>
        <p className="text-slate-600">Manage user verifications and platform security.</p>
      </div>

      <div className="grid gap-8">
        {/* Pending Verifications */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-yellow-400 pl-3">
            Pending Verifications ({unverifiedAlumni.length})
          </h2>
          
          {unverifiedAlumni.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-slate-500 italic">
              No pending verifications.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {unverifiedAlumni.map(user => (
                <div key={user.id} className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-yellow-400 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900">{user.name}</h3>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Unverified</span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-4">
                      <div className="flex items-center"><Mail size={14} className="mr-2"/> {user.email}</div>
                      <div className="flex items-center"><Briefcase size={14} className="mr-2"/> {user.department} (Class of {user.graduationYear})</div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button className="text-red-600 text-sm font-medium hover:underline">Reject</button>
                    <button 
                      onClick={() => verifyUser(user.id)}
                      className="bg-brand-900 text-white px-4 py-2 rounded text-sm hover:bg-brand-800 transition flex items-center"
                    >
                      <CheckCircle size={16} className="mr-1" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Verified Alumni */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-brand-500 pl-3">
            Verified Alumni ({verifiedAlumni.length})
          </h2>
           <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
             <table className="min-w-full divide-y divide-slate-200">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-slate-200">
                 {verifiedAlumni.map(user => (
                   <tr key={user.id}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-900">{user.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.department}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                         Verified
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;