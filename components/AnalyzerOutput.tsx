
import React from 'react';
import type { AnalysisResult } from '../services/geminiService';
import { CircularProgress } from './common/CircularProgress';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface AnalyzerOutputProps {
  result: AnalysisResult;
}

const FeedbackSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t border-slate-800 pt-4">
        <h3 className="text-base font-semibold text-slate-100 mb-2 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-violet-400" />
            {title}
        </h3>
        <div className="text-sm text-slate-400 space-y-3 whitespace-pre-wrap">{children}</div>
    </div>
);


export const AnalyzerOutput: React.FC<AnalyzerOutputProps> = ({ result }) => {
  const isTargeted = result.score !== undefined && result.keywords !== undefined;
  const isAtsAnalysis = result.atsFriendliness !== undefined;

  const scoreValue = isTargeted ? result.score! : (isAtsAnalysis ? result.atsFriendliness.score : 0);
  const hasScore = isTargeted || isAtsAnalysis;

  const scoreTitle = isTargeted ? "Resume Tailoring Score" : "ATS Friendliness Score";
  const scoreDescription = isTargeted 
    ? "This score reflects how well your resume is tailored to the job description based on keywords and skills."
    : "This score reflects how well your resume is structured for automated screening systems (ATS).";


  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 h-full flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">Resume Analysis Report</h2>
      </div>
      <div className="p-6 overflow-y-auto flex-grow space-y-6">
        
        {hasScore && (
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <h3 className="text-base font-semibold text-slate-200 mb-4">{scoreTitle}</h3>
              <div className="relative w-32 h-32 mx-auto">
                <CircularProgress percentage={scoreValue} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-100">{scoreValue}</span>
                  <span className="text-lg font-semibold text-slate-400 mt-1">%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto">{scoreDescription}</p>
            </div>
        )}

        {isTargeted && (
            <div className="border-t border-slate-800 pt-4">
                <h3 className="text-base font-semibold text-slate-100 mb-3">Keyword Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h4 className="font-semibold text-green-400 mb-2 text-sm flex items-center"><CheckCircleIcon className="h-5 w-5 mr-2" />Keywords Found</h4>
                        {result.keywords!.present.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {result.keywords!.present.map(kw => <li key={kw} className="text-sm text-slate-300">{kw}</li>)}
                            </ul>
                        ) : (
                        <p className="text-sm text-slate-500 italic">No strong keyword matches found.</p>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-400 mb-2 text-sm flex items-center"><XCircleIcon className="h-5 w-5 mr-2" />Keywords Missing</h4>
                        {result.keywords!.missing.length > 0 ? (
                            <ul className="list-disc list-inside space-y-1">
                                {result.keywords!.missing.map(kw => <li key={kw} className="text-sm text-slate-300">{kw}</li>)}
                            </ul>
                        ) : (
                        <p className="text-sm text-slate-500 italic">Great job! No critical keywords seem to be missing.</p>
                        )}
                    </div>
                </div>
            </div>
        )}
        
        <FeedbackSection title="Overall Impression">
            <p>{result.overallImpression}</p>
        </FeedbackSection>

        {isAtsAnalysis && (
            <FeedbackSection title="ATS Friendliness & Parsability">
                <p>{result.atsFriendliness.feedback}</p>
            </FeedbackSection>
        )}
        
        <FeedbackSection title="Formatting & Readability">
            <p>{result.formattingAndReadability}</p>
        </FeedbackSection>

        <FeedbackSection title="Impact & Action Verbs">
            <p>{result.impactAndActionVerbs}</p>
        </FeedbackSection>

        <FeedbackSection title="Contact Information">
            <p>{result.contactInfoFeedback}</p>
        </FeedbackSection>

        <FeedbackSection title="Experience Section">
            <p>{result.experienceSectionFeedback}</p>
        </FeedbackSection>

        <FeedbackSection title="Skills Section">
            <p>{result.skillsSectionFeedback}</p>
        </FeedbackSection>

        <FeedbackSection title="Projects Section">
            <p>{result.projectsSectionFeedback}</p>
        </FeedbackSection>

        <FeedbackSection title="Education Section">
            <p>{result.educationSectionFeedback}</p>
        </FeedbackSection>
        
      </div>
    </div>
  );
};