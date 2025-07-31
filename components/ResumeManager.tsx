
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
    <div className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 px-2">Your Resumes</h2>
      <div className="space-y-2 flex-grow">
        {resumes.length === 0 ? (
          <p className="text-slate-500 text-sm px-2">No resumes saved yet. Add one to get started!</p>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => onSelectResume(resume.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                selectedResumeId === resume.id
                  ? 'bg-violet-500/10 text-violet-300'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
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
                className="p-1 rounded-full text-slate-500 hover:bg-red-900/50 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
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
          className="w-full flex items-center justify-center px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Resume
        </button>
      </div>
    </div>
  );
};