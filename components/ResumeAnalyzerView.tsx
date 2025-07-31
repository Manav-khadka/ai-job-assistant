
import React, { useState, useCallback } from 'react';
import type { Resume } from '../App';
import { analyzeResume, AnalysisResult, ExperienceLevel } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { AnalyzerOutput } from './AnalyzerOutput';
import { DocumentChartBarIcon } from './icons/DocumentChartBarIcon';

interface ResumeAnalyzerViewProps {
  selectedResume: Resume | undefined;
}

const AnalyzerWelcomePlaceholder = () => (
    <div className="flex flex-col justify-center items-center h-full bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-8 text-center">
      <DocumentChartBarIcon className="h-16 w-16 text-violet-600 mb-4" />
      <h3 className="text-xl font-semibold text-slate-100">Resume Analysis Appears Here</h3>
      <p className="mt-2 text-slate-400 max-w-md">
        Select a resume and experience level to get a comprehensive AI review. You can also provide a job description for a targeted analysis.
      </p>
    </div>
  );

const AnalyzerLoader = () => (
    <div className="flex justify-center items-center h-full bg-slate-900 rounded-xl shadow-lg border border-slate-800">
      <div className="text-center p-4">
        <svg className="animate-spin h-10 w-10 text-violet-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="mt-4 text-lg font-semibold text-slate-200">Analyzing your resume...</p>
        <p className="text-sm text-slate-400">The AI is performing a detailed review based on your experience level and job description.</p>
      </div>
    </div>
);

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({ selectedResume }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('fresher');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!selectedResume) {
      setError('Please select a resume first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(selectedResume.content, experienceLevel, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedResume, jobDescription, experienceLevel]);
  
  const isReady = !!selectedResume;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 items-start">
      <div className="lg:col-span-4">
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 space-y-6">
          
          <div>
            <label htmlFor="experience-level" className="block text-xl font-semibold text-slate-100 mb-2">Experience Level</label>
            <p className="text-slate-400 mb-4 text-sm">Select your current experience level so the AI can tailor its feedback accordingly.</p>
             <select
                id="experience-level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                className="w-full p-3 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-slate-800/60"
             >
                <option value="fresher">Fresher / Entry-Level</option>
                <option value="mid-level">Mid-Level (2-7 years)</option>
                <option value="senior">Senior (7+ years)</option>
             </select>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Job Description (Optional)</h2>
            <p className="text-slate-400 mb-4 text-sm">For a targeted analysis, paste a job description. Otherwise, leave this blank for a general resume review.</p>
            <textarea
              className="w-full h-48 p-3 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition duration-150 ease-in-out resize-y bg-slate-800/60"
              placeholder="Paste job description here for a tailored analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              aria-label="Job Description for Analysis"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !isReady}
              className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-md hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 transition-all duration-200 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                 "Analyze"
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-5 lg:sticky lg:top-24 h-[calc(100vh-7.5rem)]">
          {error && (
            <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-r-lg shadow" role="alert">
              <p className="font-bold">Analysis Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !analysisResult && !error && <AnalyzerWelcomePlaceholder />}
          {isLoading && <AnalyzerLoader />}
          {!isLoading && analysisResult && (
            <AnalyzerOutput result={analysisResult} />
          )}
      </div>
    </div>
  );
};