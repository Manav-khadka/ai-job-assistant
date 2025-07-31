
import React, { useState } from 'react';
import type { GeneratedAssets } from '../services/geminiService';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';

type Tab = 'email' | 'coverLetter' | 'qAndA' | 'dsa' | 'experiences';

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center space-x-2 transition-all duration-200 ${
        copied
          ? 'bg-green-500/20 text-green-400'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
      <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

// This component parses the AI's formatted text into clean HTML.
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Replace **text** with <strong>text</strong>
  const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-violet-400">$1</strong>');
  
  return (
    <div className="prose prose-sm max-w-none text-slate-300 prose-p:text-slate-300">
      {bolded.split('\n\n').map((paragraph, index) => (
        <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br />') }} />
      ))}
    </div>
  );
};


export const OutputDisplay: React.FC<{ assets: GeneratedAssets }> = ({ assets }) => {
  const [activeTab, setActiveTab] = useState<Tab>('email');
  
  const tabs: Tab[] = ['email', 'coverLetter', 'qAndA'];
  if (assets.dsaQuestions && assets.dsaQuestions.length > 0) {
    tabs.push('dsa');
  }
  if (assets.experiences && assets.experiences.length > 0) {
    tabs.push('experiences');
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'email':
        return <FormattedText text={assets.email} />;
      case 'coverLetter':
        return <FormattedText text={assets.coverLetter} />;
      case 'qAndA':
        return (
          <div className="space-y-6">
            {assets.qAndA.map((item, index) => (
              <div key={index}>
                <h4 className="font-semibold text-slate-100 mb-1">{item.question}</h4>
                <p className="text-slate-400 text-sm whitespace-pre-wrap">{item.answer}</p>
              </div>
            ))}
          </div>
        );
      case 'dsa':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-100">Data Structures & Algorithms</h3>
             <p className="text-sm text-slate-500 -mt-4">Technical questions generated for this role.</p>
            {assets.dsaQuestions?.map((item, index) => (
              <div key={index} className="border-t border-slate-800 pt-4 first:border-t-0 first:pt-0">
                <h4 className="font-semibold text-slate-100 mb-2 flex items-start">
                  <CodeBracketIcon className="h-5 w-5 mr-2 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span>{item.question}</span>
                </h4>
                <div className="pl-7">
                    <p className="text-sm font-semibold text-slate-300 mb-1">Optimal Approach:</p>
                    <p className="text-slate-400 text-sm whitespace-pre-wrap mb-3">{item.approach}</p>
                    {item.practiceLink && (
                        <a 
                          href={item.practiceLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm font-medium text-violet-400 hover:text-violet-300 hover:underline transition-colors"
                        >
                          <span>Practice on LeetCode</span>
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                    )}
                </div>
              </div>
            ))}
          </div>
        );
      case 'experiences':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-100">Relevant Interview Experiences</h3>
            <p className="text-sm text-slate-500 mb-4">These links were found on the web and may provide helpful insights into the interview process for similar roles or companies.</p>
            <ul className="space-y-3">
              {assets.experiences?.map((exp, index) => (
                 <li key={index} className="border-b border-slate-800 pb-3 last:border-b-0 last:pb-0">
                  <a href={exp.uri} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start space-x-2 text-violet-400 hover:text-violet-300">
                    <ExternalLinkIcon className="h-4 w-4 mt-1 flex-shrink-0 text-violet-500 transition-colors group-hover:text-violet-400" />
                    <span className="font-medium group-hover:underline">{exp.title || 'Untitled Article'}</span>
                  </a>
                  <p className="text-xs text-slate-500 mt-1 ml-6 truncate" title={exp.uri}>{exp.uri}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const getTextForCopy = () => {
    switch (activeTab) {
      case 'email':
        return assets.email;
      case 'coverLetter':
        return assets.coverLetter;
      case 'qAndA':
        return assets.qAndA.map(qa => `Q: ${qa.question}\n\nA: ${qa.answer}`).join('\n\n---\n\n');
      case 'dsa':
        return assets.dsaQuestions?.map(dsa => `Question: ${dsa.question}\n\nApproach: ${dsa.approach}\n\nPractice Link: ${dsa.practiceLink}`).join('\n\n---\n\n') || '';
      case 'experiences':
        return assets.experiences?.map(exp => `${exp.title}\n${exp.uri}`).join('\n\n---\n\n') || '';
      default:
        return '';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
        <div>
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 font-medium text-xs sm:text-sm rounded-md transition-colors duration-150 ${
                  activeTab === tab
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                {tab === 'qAndA' ? 'Q&A' : tab === 'dsa' ? 'DSA' : tab === 'experiences' ? 'Experiences' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <CopyButton textToCopy={getTextForCopy()} />
      </div>
      <div className="p-6 overflow-y-auto flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};