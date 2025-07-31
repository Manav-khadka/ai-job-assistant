import React from 'react';
import { Spinner } from './common/Spinner';

interface GeneratorControlsProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isReady: boolean;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  jobDescription,
  setJobDescription,
  onGenerate,
  isLoading,
  isReady,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Job Description</h2>
        <p className="text-slate-600 mb-4 text-sm">Paste the job description for the role you're applying for. The AI will tailor your assets based on this information.</p>
        <textarea
          className="w-full h-64 p-3 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-150 ease-in-out resize-y bg-slate-50/50"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          aria-label="Job Description"
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading || !isReady}
          className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
             "Generate My Kit"
          )}
        </button>
      </div>
    </div>
  );
};