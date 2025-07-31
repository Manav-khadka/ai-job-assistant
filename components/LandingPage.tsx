
import React from 'react';
import { PencilSquareIcon } from './icons/PencilSquareIcon';
import { DocumentChartBarIcon } from './icons/DocumentChartBarIcon';
import { SparklesIcon } from './icons/SparklesIcon';


const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 text-center flex flex-col items-center">
        <div className="bg-slate-900 p-3 rounded-full mb-4 border border-slate-700">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm flex-grow">{description}</p>
    </div>
);


export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 flex flex-col items-center justify-center p-4">
       <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center items-center space-x-4 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
                Your AI-Powered Career Co-Pilot
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                From creation to application, get the tools you need to land your dream job. Build a professional resume, analyze it against any role, and generate a full application kit in seconds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <FeatureCard 
                    icon={<PencilSquareIcon className="h-8 w-8 text-violet-400" />}
                    title="Create"
                    description="Build a professional, ATS-friendly resume from scratch with our intuitive, template-based editor."
                />
                <FeatureCard 
                    icon={<DocumentChartBarIcon className="h-8 w-8 text-violet-400" />}
                    title="Analyze"
                    description="Get instant, AI-driven feedback on your resume's quality, or see how well it's tailored for a specific job."
                />
                 <FeatureCard 
                    icon={<SparklesIcon className="h-8 w-8 text-violet-400" />}
                    title="Get Kit"
                    description="Generate a complete application kit—including a cover letter, email, and interview prep questions."
                />
            </div>
            
            <button
                onClick={onGetStarted}
                className="px-10 py-4 bg-violet-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-violet-600/30 hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-violet-500 transition-all duration-300 transform hover:scale-105"
            >
                Get Started for Free
            </button>
       </div>
    </div>
  );
};