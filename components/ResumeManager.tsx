import React from 'react';
import type { Resume } from '../App';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface ResumeManagerProps {
  resumes: Resume[];
  selectedResumeId: string | null;
  onSelectResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onOpenModal: () => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({
  resumes,
  selectedResumeId,
  onSelectResume,
  onDeleteResume,
  onOpenModal
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 h-full">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 px-2">Your Resumes</h2>
      <div className="space-y-2">
        {resumes.length === 0 ? (
          <p className="text-slate-500 text-sm px-2">No resumes saved yet. Add one to get started!</p>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => onSelectResume(resume.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                selectedResumeId === resume.id
                  ? 'bg-violet-100 text-violet-900'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium text-sm truncate">{resume.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent selection when deleting
                  onDeleteResume(resume.id);
                }}
                className="p-1 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label={`Delete ${resume.name}`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={onOpenModal}
          className="w-full flex items-center justify-center px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Resume
        </button>
      </div>
    </div>
  );
};