import React from 'react';
import { useApp } from '../context/AppContext';
import { Application, ApplicationStatus } from '../types';

const ATSBoard: React.FC = () => {
  const { applications, updateApplicationStatus } = useApp();

  const columns = [
    { title: 'Applied', status: ApplicationStatus.APPLIED, color: 'bg-slate-100' },
    { title: 'Screening', status: ApplicationStatus.SCREENING, color: 'bg-blue-50' },
    { title: 'Interview', status: ApplicationStatus.INTERVIEW, color: 'bg-purple-50' },
    { title: 'Offered', status: ApplicationStatus.OFFERED, color: 'bg-green-50' },
    { title: 'Rejected', status: ApplicationStatus.REJECTED, color: 'bg-red-50' },
  ];

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData('appId', appId);
  };

  const handleDrop = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    updateApplicationStatus(appId, status);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col p-4 overflow-hidden">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-brand-900">Application Tracking System</h1>
        <p className="text-slate-500 text-sm">Drag and drop candidates to manage their status.</p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full space-x-4 min-w-max">
          {columns.map(col => (
            <div 
              key={col.status}
              className={`w-72 rounded-lg flex flex-col ${col.color}`}
              onDrop={(e) => handleDrop(e, col.status)}
              onDragOver={handleDragOver}
            >
              <div className="p-3 font-semibold text-brand-900 border-b border-black/5 flex justify-between">
                <span>{col.title}</span>
                <span className="bg-white/50 px-2 rounded text-sm">
                  {applications.filter(a => a.status === col.status).length}
                </span>
              </div>
              
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {applications
                  .filter(app => app.status === col.status)
                  .map(app => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      className="bg-white p-3 rounded shadow-sm border border-slate-200 cursor-move hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-bold text-brand-800">{app.studentName}</h4>
                      <p className="text-xs text-slate-500">Applied: {app.appliedAt}</p>
                      <div className="mt-2 text-xs text-slate-400">ID: {app.id}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATSBoard;