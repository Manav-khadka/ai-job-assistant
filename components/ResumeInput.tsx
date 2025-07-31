
import React, { useState } from 'react';

interface ResumeInputProps {
  resume: string;
  setResume: (value: string) => void;
}

export const ResumeInput: React.FC<ResumeInputProps> = ({ resume, setResume }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // The actual saving is handled by the useLocalStorage hook in App.tsx
    // This just provides user feedback
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Resume</h2>
      <p className="text-gray-600 mb-4 text-sm">Paste your full resume here. It will be saved securely in your browser's local storage and will only be used to generate cover letters.</p>
      <textarea
        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
        placeholder="Paste your resume here..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />
      <div className="mt-4 flex items-center justify-end">
        {isSaved && (
           <span className="text-green-600 text-sm mr-4 transition-opacity duration-300 ease-in-out">Saved!</span>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Save Resume
        </button>
      </div>
    </div>
  );
};
