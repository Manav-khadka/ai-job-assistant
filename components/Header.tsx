
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { DocumentChartBarIcon } from './icons/DocumentChartBarIcon';
import { PencilSquareIcon } from './icons/PencilSquareIcon';

export type ActiveView = 'kit' | 'analyzer' | 'create';

interface HeaderProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
        isActive
          ? 'bg-violet-600 text-white shadow-md'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ activeView, onNavigate }) => {
  return (
    <header className="bg-slate-950/75 backdrop-blur-sm border-b border-slate-800 shadow-lg shadow-violet-950/20 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
           </svg>
          <h1 className="text-xl font-bold text-slate-100 hidden sm:block">
            Intelligent Job Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
           <NavButton 
             label="Create"
             icon={<PencilSquareIcon className="h-5 w-5" />}
             isActive={activeView === 'create'}
             onClick={() => onNavigate('create')}
           />
           <NavButton 
             label="Get Kit"
             icon={<SparklesIcon className="h-5 w-5" />}
             isActive={activeView === 'kit'}
             onClick={() => onNavigate('kit')}
           />
           <NavButton 
             label="Analyze"
             icon={<DocumentChartBarIcon className="h-5 w-5" />}
             isActive={activeView === 'analyzer'}
             onClick={() => onNavigate('analyzer')}
           />
        </div>
      </div>
    </header>
  );
};