
import React, { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header, ActiveView } from './components/Header';
import { ResumeManager } from './components/ResumeManager';
import { GeneratorControls } from './components/GeneratorControls';
import { OutputDisplay } from './components/OutputDisplay';
import { AddResumeModal } from './components/AddResumeModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateRecruitmentAssets, GeneratedAssets, analyzeResume as analyzeResumeService, AnalysisResult } from './services/geminiService';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { ResumeMakerView } from './components/ResumeMakerView';
import { LandingPage } from './components/LandingPage';

export interface Resume {
  id: string;
  name: string;
  content: string;
}

const WelcomePlaceholder = () => (
  <div className="flex flex-col justify-center items-center h-full bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-8 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-violet-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 className="text-xl font-semibold text-slate-100">Your Application Assets Appear Here</h3>
    <p className="mt-2 text-slate-400 max-w-md">
      Add a resume, paste a job description, and click "Generate My Kit" to create a tailored email, cover letter, Q&A, a list of top DSA questions compiled from the web, and relevant interview experiences.
    </p>
  </div>
);

const Loader = () => (
  <div className="flex justify-center items-center h-full bg-slate-900 rounded-xl shadow-lg border border-slate-800">
    <div className="text-center p-4">
      <svg className="animate-spin h-10 w-10 text-violet-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <p className="mt-4 text-lg font-semibold text-slate-200">Generating your kit...</p>
      <p className="text-sm text-slate-400">The AI is creating documents, searching for interview experiences, and compiling top DSA questions from across the web.</p>
    </div>
  </div>
);

export default function App() {
  const [resumes, setResumes] = useLocalStorage<Resume[]>('user-resumes', []);
  const [selectedResumeId, setSelectedResumeId] = useLocalStorage<string | null>('selected-resume-id', null);
  const [jobDescription, setJobDescription] = useState('');
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('kit');
  const [showApp, setShowApp] = useState(false);

  const selectedResume = useMemo(() => resumes.find(r => r.id === selectedResumeId), [resumes, selectedResumeId]);

  const handleAddResume = (name: string, content: string) => {
    const newResume = { id: uuidv4(), name, content };
    const newResumes = [...resumes, newResume];
    setResumes(newResumes);
    // Select the new resume after adding it
    setSelectedResumeId(newResume.id);
  };

  const handleDeleteResume = (id: string) => {
    const newResumes = resumes.filter(r => r.id !== id);
    setResumes(newResumes);
    if (selectedResumeId === id) {
      setSelectedResumeId(newResumes.length > 0 ? newResumes[0].id : null);
    }
  };
  
  const handleGenerate = useCallback(async () => {
    if (!selectedResume) {
      setError('Please select a resume first.');
      return;
    }
    if (!jobDescription) {
      setError('Please provide a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedAssets(null);

    try {
      const assets = await generateRecruitmentAssets(selectedResume.content, jobDescription);
      setGeneratedAssets(assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedResume, jobDescription]);
  
  const handleSaveAndNavigateToKit = (name: string, content: string) => {
    handleAddResume(name, content);
    setActiveView('kit');
  };

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <Header activeView={activeView} onNavigate={setActiveView} />
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            <ResumeManager 
              resumes={resumes}
              selectedResumeId={selectedResumeId}
              onSelectResume={setSelectedResumeId}
              onDeleteResume={handleDeleteResume}
              onOpenModal={() => setIsModalOpen(true)}
            />
          </aside>

          <div className="lg:col-span-9">
             {activeView === 'kit' && (
               <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 items-start">
                <div className="lg:col-span-4">
                  <GeneratorControls
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    isReady={!!selectedResume && !!jobDescription}
                  />
                </div>
                <div className="lg:col-span-5 lg:sticky lg:top-24 h-[calc(100vh-7.5rem)]">
                    {error && (
                    <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 mb-6 rounded-r-lg shadow" role="alert">
                      <p className="font-bold">Generation Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  {!isLoading && !generatedAssets && !error && <WelcomePlaceholder />}
                  {isLoading && <Loader />}
                  {!isLoading && generatedAssets && (
                    <OutputDisplay assets={generatedAssets} />
                  )}
                </div>
              </div>
             )}
             {activeView === 'analyzer' && (
                <ResumeAnalyzerView selectedResume={selectedResume} />
             )}
             {activeView === 'create' && (
                <ResumeMakerView onSaveResume={handleSaveAndNavigateToKit} />
             )}
          </div>
        </div>
      </main>
      
      {isModalOpen && (
        <AddResumeModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddResume}
        />
      )}
    </div>
  );
}