
import React from 'react';
import { Spinner } from './common/Spinner';

interface JobInputProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const JobInput: React.FC<JobInputProps> = ({ jobDescription, setJobDescription, onGenerate, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
      <p className="text-gray-600 mb-4 text-sm">Paste the job description for the role you're applying to. The AI will tailor the email based on this information.</p>
      <textarea
        className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span className="ml-2">Generating...</span>
            </>
          ) : (
             "Generate Email"
          )}
        </button>
      </div>
    </div>
  );
};
