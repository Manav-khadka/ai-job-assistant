
import React, { useState, useRef, useCallback } from 'react';
import jsPDF from 'jspdf';
import { ResumeForm } from './ResumeForm';
import { ResumePreview } from './ResumePreview';
import { initialResumeData, ResumeData, formatResumeDataAsText, Section } from '../utils/resumeUtils';
import { Spinner } from './common/Spinner';

interface ResumeMakerViewProps {
  onSaveResume: (name: string, content: string) => void;
}

export const ResumeMakerView: React.FC<ResumeMakerViewProps> = ({ onSaveResume }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(() => {
    setIsDownloading(true);
    try {
        const pdf = new jsPDF('p', 'mm', 'letter');
        const margin = 15;
        const pageW = pdf.internal.pageSize.getWidth();
        const contentW = pageW - margin * 2;
        let currentY = 15;

        pdf.setFont('Times', 'normal');

        const checkPageBreak = (neededHeight: number) => {
            if (currentY + neededHeight > pdf.internal.pageSize.getHeight() - margin) {
                pdf.addPage();
                currentY = margin;
            }
        };

        // --- HEADER ---
        pdf.setFontSize(28);
        pdf.setFont('Times', 'bold');
        pdf.text(resumeData.personalInfo.name.toUpperCase(), pageW / 2, currentY, { align: 'center' });
        currentY += 6;

        pdf.setFontSize(9);
        pdf.setFont('Times', 'normal');
        pdf.text(resumeData.personalInfo.address, pageW / 2, currentY, { align: 'center' });
        currentY += 5;
        
        const allLinks = [
            resumeData.personalInfo.phone ? { label: resumeData.personalInfo.phone, url: `tel:${resumeData.personalInfo.phone}` } : null,
            resumeData.personalInfo.email ? { label: resumeData.personalInfo.email, url: `mailto:${resumeData.personalInfo.email}` } : null,
            resumeData.personalInfo.linkedin ? { label: resumeData.personalInfo.linkedin, url: `https://${resumeData.personalInfo.linkedin}` } : null,
            resumeData.personalInfo.github ? { label: resumeData.personalInfo.github, url: `https://${resumeData.personalInfo.github}` } : null,
            ...(resumeData.personalInfo.customLinks || []).map(link => ({ label: link.name, url: link.url }))
        ].filter((item): item is { label: string, url: string } => !!(item && item.label && item.url));
        
        const contactLine = allLinks.map(link => link.label).join('  •  ');
        const totalWidth = pdf.getStringUnitWidth(contactLine) * pdf.getFontSize() / pdf.internal.scaleFactor;
        const startX = (pageW - totalWidth) / 2;
        
        pdf.text(contactLine, pageW / 2, currentY, { align: 'center' });
        let currentX = startX;

        for(let i = 0; i < allLinks.length; i++) {
            const { label, url } = allLinks[i];
            const labelWidth = pdf.getStringUnitWidth(label) * pdf.getFontSize() / pdf.internal.scaleFactor;
            
            if (url.startsWith('http') || url.startsWith('mailto') || url.startsWith('tel')) {
                pdf.link(currentX, currentY - 3.5, labelWidth, 4, { url });
            }
            
            currentX += labelWidth + (pdf.getStringUnitWidth('  •  ') * pdf.getFontSize() / pdf.internal.scaleFactor);
        }
        
        currentY += 10;
        
        // --- SECTIONS (DYNAMIC) ---
        const drawSectionHeader = (title: string) => {
            checkPageBreak(12);
            pdf.setFontSize(10);
            pdf.setFont('Times', 'bold');
            pdf.text(title.toUpperCase(), margin, currentY);
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.2);
            pdf.line(margin, currentY + 1.5, pageW - margin, currentY + 1.5);
            currentY += 7;
        };

        const drawBulletList = (text: string) => {
            const items = text.split('\n').filter(line => line.trim() !== '');
            items.forEach(item => {
                const cleanItem = item.replace(/^- /, '').trim();
                if(!cleanItem) return;
                const lines = pdf.splitTextToSize(cleanItem, contentW - 5);
                checkPageBreak(lines.length * 4 + 2);
                pdf.setFontSize(9);
                pdf.text('•', margin, currentY + 0.5);
                pdf.setFont('Times', 'normal');
                pdf.text(lines, margin + 4, currentY);
                currentY += lines.length * 4 + 1;
            });
        };
        
        resumeData.sections.forEach(section => {
            let hasData = false;
            switch(section.type){
                case 'education': case 'experience': case 'projects': case 'skills': case 'leadership': hasData = section.items.length > 0; break;
                case 'coursework': case 'customText': hasData = section.content.trim() !== ''; break;
            }

            if (!hasData) return;

            drawSectionHeader(section.title);

            switch(section.type) {
                case 'education':
                    section.items.forEach(edu => {
                        checkPageBreak(10);
                        pdf.setFontSize(10);
                        pdf.setFont('Times', 'bold');
                        pdf.text(edu.school, margin, currentY);
                        pdf.setFont('Times', 'normal');
                        pdf.text(edu.date, pageW - margin, currentY, { align: 'right' });
                        currentY += 4.5;
                        checkPageBreak(5);
                        pdf.setFont('Times', 'italic');
                        pdf.text(edu.degree, margin, currentY);
                        pdf.setFont('Times', 'normal');
                        pdf.text(edu.location, pageW - margin, currentY, { align: 'right'});
                        currentY += 5;
                    });
                    break;
                case 'experience':
                     section.items.forEach(exp => {
                        checkPageBreak(15);
                        pdf.setFontSize(10);
                        pdf.setFont('Times', 'bold');
                        pdf.text(exp.company, margin, currentY);
                        pdf.setFont('Times', 'normal');
                        pdf.text(exp.date, pageW - margin, currentY, { align: 'right' });
                        currentY += 4.5;
                        checkPageBreak(5);
                        pdf.setFont('Times', 'italic');
                        pdf.text(exp.role, margin, currentY);
                        pdf.text(exp.location, pageW-margin, currentY, { align: 'right' });
                        currentY += 5;
                        pdf.setFont('Times', 'normal');
                        pdf.setFontSize(9);
                        drawBulletList(exp.description);
                    });
                    break;
                 case 'projects':
                    section.items.forEach(proj => {
                        checkPageBreak(15);
                        pdf.setFontSize(10);
                        pdf.setFont('Times', 'bold');
                        const titleText = `${proj.name}`;
                        pdf.text(titleText, margin, currentY);

                        pdf.setFont('Times', 'italic');
                        const techText = `|  ${proj.technologies}`;
                        const titleWidth = pdf.getStringUnitWidth(titleText) * pdf.getFontSize() / pdf.internal.scaleFactor;
                        pdf.text(techText, margin + titleWidth + 1, currentY);
                        
                        pdf.setFont('Times', 'normal');
                        pdf.text(proj.date, pageW - margin, currentY, { align: 'right'});

                        currentY += 5;
                        pdf.setFont('Times', 'normal');
                        pdf.setFontSize(9);
                        drawBulletList(proj.description);
                        currentY += 1;
                    });
                    break;
                case 'skills':
                    let skillCurrentX = margin;
                    pdf.setFontSize(9);
                    section.items.forEach((skill) => {
                        pdf.setFont('Times', 'bold');
                        const typeText = `${skill.type}:`;
                        pdf.text(typeText, skillCurrentX, currentY);
                        const typeWidth = pdf.getStringUnitWidth(typeText) * pdf.getFontSize() / pdf.internal.scaleFactor;

                        pdf.setFont('Times', 'normal');
                        const listText = ` ${skill.list}`;
                        const listLines = pdf.splitTextToSize(listText, contentW - skillCurrentX + margin - typeWidth);
                        pdf.text(listLines, skillCurrentX + typeWidth, currentY);
                        currentY += listLines.length * 4.5;
                    });
                    currentY += 2;
                    break;
                 case 'leadership':
                    section.items.forEach(lead => {
                        checkPageBreak(15);
                        pdf.setFontSize(10);
                        pdf.setFont('Times', 'bold');
                        pdf.text(lead.organization, margin, currentY);
                        pdf.setFont('Times', 'normal');
                        pdf.text(lead.date, pageW - margin, currentY, { align: 'right' });
                        currentY += 4.5;
                        checkPageBreak(5);
                        pdf.setFont('Times', 'italic');
                        pdf.text(lead.role, margin, currentY);
                        currentY += 5;
                        pdf.setFont('Times', 'normal');
                        pdf.setFontSize(9);
                        drawBulletList(lead.description);
                    });
                    break;
                case 'coursework':
                    const courses = section.content.split(',').map(c => c.trim()).filter(c => c);
                    const colWidth = contentW / 4;
                    pdf.setFontSize(9);
                    pdf.setFont('Times','normal');
                    for (let i = 0; i < courses.length; i++) {
                        const col = i % 4;
                        const row = Math.floor(i / 4);
                        if (col === 0 && i > 0) currentY += 4;
                        checkPageBreak(4);
                        pdf.text(`• ${courses[i]}`, margin + col * colWidth, currentY + row * 4);
                    }
                    currentY += Math.ceil(courses.length / 4) * 4;
                    break;
                case 'customText':
                    pdf.setFontSize(9);
                    pdf.setFont('Times','normal');
                    const lines = pdf.splitTextToSize(section.content, contentW);
                    checkPageBreak(lines.length * 4 + 2);
                    pdf.text(lines, margin, currentY);
                    currentY += lines.length * 4 + 1;
                    break;
            }
            currentY += 1;
        });
        
        const fileName = resumeData.personalInfo.name ? `${resumeData.personalInfo.name.replace(/\s/g, '_')}_Resume.pdf` : 'resume.pdf';
        pdf.save(fileName);
        
    } catch (err) {
        console.error("Error generating PDF:", err);
    } finally {
        setIsDownloading(false);
    }
  }, [resumeData]);
  
  const handleSave = () => {
      const resumeName = `${resumeData.personalInfo.name}'s Resume`;
      const resumeContent = formatResumeDataAsText(resumeData);
      onSaveResume(resumeName, resumeContent);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 items-start">
      <div className="lg:col-span-4">
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800">
           <div className="p-4 border-b border-slate-800 flex justify-between items-center">
             <h2 className="text-xl font-semibold text-slate-100">Resume Editor</h2>
             <div className="flex space-x-2">
                <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex items-center justify-center px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-all duration-200 disabled:opacity-50"
                >
                    {isDownloading && <Spinner />}
                    <span className={isDownloading ? "ml-2" : ""}>Download PDF</span>
                </button>
                 <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 transition-colors duration-200"
                >
                    Save Resume
                 </button>
             </div>
           </div>
           <div className="p-6 h-[calc(100vh-10.5rem)] overflow-y-auto">
             <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
           </div>
        </div>
      </div>
      <div className="lg:col-span-5 lg:sticky lg:top-24 h-[calc(100vh-7.5rem)]">
        <div className="bg-white rounded-lg shadow-2xl h-full overflow-y-auto">
            <ResumePreview ref={previewRef} data={resumeData} />
        </div>
      </div>
    </div>
  );
};