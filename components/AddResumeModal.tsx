
import React, { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { XMarkIcon } from './icons/XMarkIcon';
import { Spinner } from './common/Spinner';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

interface AddResumeModalProps {
  onClose: () => void;
  onSave: (name: string, content: string) => void;
}

type Tab = 'paste' | 'upload';

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = '';
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

export const AddResumeModal: React.FC<AddResumeModalProps> = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<Tab>('paste');
  const [resumeName, setResumeName] = useState('');
  const [resumeContent, setResumeContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    setUploadedFile(file);

    if (!resumeName) {
      setResumeName(file.name.replace(/\.pdf$/i, ''));
    }

    try {
      const text = await extractTextFromPdf(file);
      setResumeContent(text);
    } catch (e) {
      setError("Failed to parse PDF. Please try pasting the text instead.");
      console.error(e);
      setUploadedFile(null); // Clear file on error
    } finally {
      setIsProcessing(false);
    }
  }, [resumeName]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setResumeContent('');
    setError(null);
    // Reset file input
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  const handleSave = () => {
    if (!resumeName.trim() || !resumeContent.trim()) {
      setError('Please provide a name and ensure resume content is not empty.');
      return;
    }
    onSave(resumeName.trim(), resumeContent.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh] border border-slate-800">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-100">Add New Resume</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-700" aria-label="Close modal">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="resumeName" className="block text-sm font-medium text-slate-400 mb-1">Resume Name</label>
            <input
              type="text"
              id="resumeName"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder='e.g., "Software Engineer Resume"'
              className="w-full p-2 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-slate-800"
            />
          </div>
          
          <div className="border-b border-slate-800">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <button onClick={() => setActiveTab('paste')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'paste' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}>
                Paste Text
              </button>
              <button onClick={() => setActiveTab('upload')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload' ? 'border-violet-500 text-violet-400' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}>
                Upload PDF
              </button>
            </nav>
          </div>

          {activeTab === 'paste' && (
            <textarea
              className="w-full h-48 p-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-y text-slate-300 placeholder-slate-500 bg-slate-800"
              placeholder="Paste your resume content here..."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
            />
          )}

          {activeTab === 'upload' && (
             <div className="space-y-2">
                {!uploadedFile ? (
                  <label
                    htmlFor="pdf-upload"
                    className="relative block w-full rounded-lg border-2 border-dashed border-slate-700 p-8 text-center hover:border-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 cursor-pointer"
                  >
                    <UploadIcon className="mx-auto h-12 w-12 text-slate-600" />
                    <span className="mt-2 block text-sm font-semibold text-violet-400">
                      Click to upload a PDF
                    </span>
                    <span className="block text-sm text-slate-500">or drag and drop</span>
                    <input id="pdf-upload" name="pdf-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="w-full text-center p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                    {isProcessing ? (
                      <div className="flex justify-center items-center text-sm text-slate-400">
                        <Spinner /> <span className="ml-2">Processing PDF...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileIcon className="h-6 w-6 text-violet-500" />
                          <span className="font-medium text-sm text-slate-300 truncate">{uploadedFile.name}</span>
                        </div>
                        <button onClick={handleRemoveFile} className="p-1 rounded-full text-slate-500 hover:bg-slate-700" aria-label="Remove file">
                          <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
             </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800 flex justify-end space-x-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-transparent text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800">Cancel</button>
          <button onClick={handleSave} disabled={isProcessing || !resumeContent.trim()} className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-sm hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed">
            {isProcessing ? 'Processing...' : 'Save Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};