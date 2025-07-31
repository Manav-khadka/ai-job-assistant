
import React from 'react';
import { ResumeData, Section } from '../utils/resumeUtils';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
    
    const BulletList: React.FC<{ text: string }> = ({ text }) => {
        const items = text.split('\n').filter(line => line.trim() !== '');
        if (items.length === 0) return null;
        
        return (
            <ul className="pl-4 mt-1 space-y-1">
                {items.map((item, index) => (
                    <li key={index} className="text-sm leading-relaxed flex items-start">
                        <span className="text-lg mr-2 text-gray-800 -mt-0.5">•</span>
                        <span>{item.replace(/^- /, '')}</span>
                    </li>
                ))}
            </ul>
        );
    };
    
    const SectionPreview: React.FC<{section: Section}> = ({ section }) => {
        let content: React.ReactNode = null;
        let hasData = false;

        switch (section.type) {
            case 'education':
                hasData = section.items.length > 0;
                content = (
                    <div className="space-y-2">
                        {section.items.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base">{edu.school}</h3>
                                    <p className="text-sm font-normal">{edu.date}</p>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <p className="italic text-sm">{edu.degree}</p>
                                    <p className="italic text-sm">{edu.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'coursework':
                const courses = section.content.split(',').map(c => c.trim()).filter(c => c);
                hasData = courses.length > 0;
                content = (
                    <div className="columns-4">
                       {courses.map(course => <div key={course} className="text-sm mb-1">• {course}</div>)}
                    </div>
                );
                break;
            case 'experience':
                hasData = section.items.length > 0;
                content = (
                     <div className="space-y-3">
                        {section.items.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base">{exp.company}</h3>
                                    <p className="text-sm font-normal">{exp.date}</p>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <h4 className="italic text-sm">{exp.role}</h4>
                                    <h4 className="italic text-sm">{exp.location}</h4>
                                </div>
                                <BulletList text={exp.description} />
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'projects':
                hasData = section.items.length > 0;
                content = (
                    <div className="space-y-3">
                        {section.items.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base">
                                        {proj.name}
                                        <span className="font-normal text-sm italic mx-2">|</span>
                                        <span className="font-normal italic text-sm">{proj.technologies}</span>
                                    </h3>
                                    <p className="text-sm font-normal">{proj.date}</p>
                                </div>
                                <BulletList text={proj.description} />
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'skills':
                hasData = section.items.length > 0;
                content = (
                    <div className="space-y-1">
                        {section.items.map((skill) => (
                            <div key={skill.id} className="text-sm">
                                <span className="font-bold">{skill.type}: </span>
                                <span>{skill.list}</span>
                            </div>
                        ))}
                    </div>
                );
                break;
             case 'leadership':
                hasData = section.items.length > 0;
                content = (
                    <div className="space-y-3">
                        {section.items.map((lead) => (
                            <div key={lead.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base">{lead.organization}</h3>
                                    <p className="text-sm font-normal">{lead.date}</p>
                                </div>
                                <h4 className="italic text-sm">{lead.role}</h4>
                                <BulletList text={lead.description} />
                            </div>
                        ))}
                    </div>
                );
                break;
            case 'customText':
                hasData = section.content.trim() !== '';
                content = (
                    <p className="text-sm leading-relaxed">{section.content}</p>
                );
                break;
        }

        if (!hasData) return null;

        return (
            <section>
                <h2 className="text-xs font-bold uppercase tracking-widest border-b-[1.5px] border-black pb-1 mb-2">
                    {section.title}
                </h2>
                {content}
            </section>
        );
    };

    return (
        <div ref={ref} className="p-8 font-['EB_Garamond',serif] text-gray-800 bg-white min-h-full leading-snug">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold tracking-wider">{data.personalInfo.name.toUpperCase()}</h1>
                <p className="text-sm mt-2">{data.personalInfo.address}</p>
                <div className="flex justify-center items-center flex-wrap text-xs mt-2 space-x-2 text-gray-600">
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.phone && data.personalInfo.email && <span className="text-gray-400">&bull;</span>}
                    {data.personalInfo.email && <a href={`mailto:${data.personalInfo.email}`} className="text-violet-600 hover:underline">{data.personalInfo.email}</a>}
                    {data.personalInfo.linkedin && <span className="text-gray-400">&bull;</span>}
                    {data.personalInfo.linkedin && <a href={`https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">{data.personalInfo.linkedin}</a>}
                    {data.personalInfo.github && <span className="text-gray-400">&bull;</span>}
                    {data.personalInfo.github && <a href={`https://${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">{data.personalInfo.github}</a>}
                    {data.personalInfo.customLinks?.filter(l => l.name && l.url).map((link) => (
                        <React.Fragment key={link.name}>
                            <span className="text-gray-400">&bull;</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">{link.name}</a>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
               {data.sections.map(section => (
                   <SectionPreview key={section.id} section={section} />
               ))}
            </div>
        </div>
    );
});

export { ResumePreview };