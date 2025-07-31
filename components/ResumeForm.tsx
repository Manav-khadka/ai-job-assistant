
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData, Section, EducationItem, ExperienceItem, ProjectItem, SkillItem, LeadershipItem } from '../utils/resumeUtils';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';

interface ResumeFormProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const Input: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string; placeholder?: string }> = ({ label, value, onChange, name, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-2 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-slate-800"
        />
    </div>
);

const Textarea: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; name: string, rows?: number }> = ({ label, value, onChange, name, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full p-2 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-slate-800 resize-y"
        />
    </div>
);

const SectionContainer: React.FC<{ 
    section: Section;
    children: React.ReactNode;
    onUpdateTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: () => void;
}> = ({ section, children, onUpdateTitle, onDelete }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-t border-slate-800">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-4 text-left cursor-pointer"
            >
                <h3 className="font-semibold text-lg text-slate-200">{section.title}</h3>
                <div className="flex items-center space-x-2">
                     <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1 rounded-full text-slate-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Delete ${section.title} section`}
                     >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                    <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {isOpen && (
                <div className="pb-4 space-y-4">
                    <Input label="Section Title" name="title" value={section.title} onChange={onUpdateTitle} />
                    <div className="border-t border-slate-700/50 my-2"></div>
                    {children}
                </div>
            )}
        </div>
    );
};


export const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, setResumeData }) => {

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ 
            ...prev, 
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };
    
    const handleCustomLinkChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedLinks = resumeData.personalInfo.customLinks.map((item, i) => i === index ? { ...item, [name]: value } : item);
        setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, customLinks: updatedLinks }}));
    };
    
    const addCustomLink = () => {
        const newLinks = [...(resumeData.personalInfo.customLinks || []), { name: '', url: '' }];
        setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, customLinks: newLinks }}));
    };

    const removeCustomLink = (index: number) => {
        const newLinks = resumeData.personalInfo.customLinks.filter((_, i) => i !== index);
        setResumeData(prev => ({...prev, personalInfo: {...prev.personalInfo, customLinks: newLinks }}));
    };
    
    const updateSection = (sectionId: string, updatedFields: Partial<Section>) => {
        setResumeData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId) {
                    // This assertion helps TypeScript understand the structure is valid
                    return { ...s, ...updatedFields } as Section;
                }
                return s;
            }),
        }));
    };

    const deleteSection = (sectionId: string) => {
        setResumeData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId)
        }));
    };

    const addSection = (type: Section['type']) => {
        let newSection: Section;
        switch(type) {
            case 'education': newSection = { id: uuidv4(), type, title: 'Education', items: [] }; break;
            case 'experience': newSection = { id: uuidv4(), type, title: 'Experience', items: [] }; break;
            case 'projects': newSection = { id: uuidv4(), type, title: 'Projects', items: [] }; break;
            case 'skills': newSection = { id: uuidv4(), type, title: 'Technical Skills', items: [] }; break;
            case 'leadership': newSection = { id: uuidv4(), type, title: 'Leadership', items: [] }; break;
            case 'coursework': newSection = { id: uuidv4(), type, title: 'Relevant Coursework', content: '' }; break;
            case 'customText': newSection = { id: uuidv4(), type, title: 'Custom Section', content: '' }; break;
            default: return;
        }
        setResumeData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    };

    const updateSectionItem = (sectionId: string, itemId: string, updatedItemFields: object) => {
        setResumeData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId && 'items' in s) {
                    const newItems = (s.items as any[]).map((item: any) => item.id === itemId ? { ...item, ...updatedItemFields } : item);
                    return { ...s, items: newItems as any };
                }
                return s;
            })
        }));
    };
    
    const addSectionItem = (sectionId: string, newItem: object) => {
        setResumeData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId && 'items' in s) {
                    return { ...s, items: [...(s.items as any[]), newItem] as any };
                }
                return s;
            })
        }));
    };
    
    const deleteSectionItem = (sectionId: string, itemId: string) => {
        setResumeData(prev => ({
            ...prev,
            sections: prev.sections.map(s => {
                if (s.id === sectionId && 'items' in s) {
                    const newItems = (s.items as any[]).filter((item: any) => item.id !== itemId);
                    return { ...s, items: newItems as any };
                }
                return s;
            })
        }));
    };

    return (
        <div className="space-y-2">
            <div className="p-4 border border-slate-800 rounded-lg bg-slate-900/50">
                 <h3 className="font-semibold text-lg text-slate-200 mb-4">Personal Information</h3>
                <Input label="Full Name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} />
                <Input label="Address" name="address" value={resumeData.personalInfo.address} onChange={handlePersonalInfoChange} />
                <Input label="Email" name="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
                <Input label="Phone" name="phone" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} />
                <Input label="LinkedIn Username" name="linkedin" value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="linkedin.com/in/username" />
                <Input label="GitHub Username" name="github" value={resumeData.personalInfo.github} onChange={handlePersonalInfoChange} placeholder="github.com/username" />
                
                <div className="pt-4">
                    <label className="block text-sm font-medium text-slate-400 mb-2">Custom Links</label>
                    <div className="space-y-3">
                        {resumeData.personalInfo.customLinks?.map((link, index) => (
                             <div key={index} className="p-3 border border-slate-700 rounded-lg space-y-2 relative bg-slate-800/50">
                                <button onClick={() => removeCustomLink(index)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>
                                <Input label="Link Name" name="name" value={link.name} onChange={(e) => handleCustomLinkChange(index, e)} placeholder="e.g., LeetCode, Portfolio" />
                                <Input label="Full URL" name="url" value={link.url} onChange={(e) => handleCustomLinkChange(index, e)} placeholder="https://..." />
                            </div>
                        ))}
                    </div>
                    <button onClick={addCustomLink} className="mt-3 flex items-center space-x-2 text-violet-400 font-semibold text-sm hover:text-violet-300"><PlusIcon className="h-5 w-5" /><span>Add Custom Link</span></button>
                </div>
            </div>

            {resumeData.sections.map((section) => (
                <SectionContainer 
                    key={section.id} 
                    section={section}
                    onUpdateTitle={(e) => updateSection(section.id, { title: e.target.value })}
                    onDelete={() => deleteSection(section.id)}
                >
                   {(() => {
                     switch(section.type) {
                        case 'education':
                            return (
                                <>
                                    {section.items.map(edu => (
                                        <div key={edu.id} className="p-4 border border-slate-700 rounded-lg space-y-3 relative">
                                            <button onClick={() => deleteSectionItem(section.id, edu.id)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>
                                            <Input label="School" name="school" value={edu.school} onChange={e => updateSectionItem(section.id, edu.id, { school: e.target.value })} />
                                            <Input label="Degree" name="degree" value={edu.degree} onChange={e => updateSectionItem(section.id, edu.id, { degree: e.target.value })} />
                                            <Input label="Date" name="date" value={edu.date} onChange={e => updateSectionItem(section.id, edu.id, { date: e.target.value })} />
                                            <Input label="Location" name="location" value={edu.location} onChange={e => updateSectionItem(section.id, edu.id, { location: e.target.value })} />
                                        </div>
                                    ))}
                                    <button onClick={() => addSectionItem(section.id, { id: uuidv4(), school: '', degree: '', date: '', location: ''} as EducationItem)} className="flex items-center space-x-2 text-violet-400 font-semibold text-sm hover:text-violet-300"><PlusIcon className="h-5 w-5" /><span>Add Education</span></button>
                                </>
                            );
                        case 'experience':
                            return (
                                <>
                                    {section.items.map(exp => (
                                        <div key={exp.id} className="p-4 border border-slate-700 rounded-lg space-y-3 relative">
                                            <button onClick={() => deleteSectionItem(section.id, exp.id)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>
                                            <Input label="Company" name="company" value={exp.company} onChange={e => updateSectionItem(section.id, exp.id, { company: e.target.value })} />
                                            <Input label="Role" name="role" value={exp.role} onChange={e => updateSectionItem(section.id, exp.id, { role: e.target.value })} />
                                            <Input label="Date" name="date" value={exp.date} onChange={e => updateSectionItem(section.id, exp.id, { date: e.target.value })} />
                                            <Input label="Location" name="location" value={exp.location} onChange={e => updateSectionItem(section.id, exp.id, { location: e.target.value })} />
                                            <Textarea label="Description" name="description" value={exp.description} onChange={e => updateSectionItem(section.id, exp.id, { description: e.target.value })} rows={4} />
                                        </div>
                                    ))}
                                    <button onClick={() => addSectionItem(section.id, { id: uuidv4(), company: '', role: '', date: '', location: '', description: '' } as ExperienceItem)} className="flex items-center space-x-2 text-violet-400 font-semibold text-sm hover:text-violet-300"><PlusIcon className="h-5 w-5" /><span>Add Experience</span></button>
                                </>
                            );
                        case 'projects':
                            return (
                                <>
                                    {section.items.map(proj => (
                                        <div key={proj.id} className="p-4 border border-slate-700 rounded-lg space-y-3 relative">
                                            <button onClick={() => deleteSectionItem(section.id, proj.id)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>
                                            <Input label="Project Name" name="name" value={proj.name} onChange={e => updateSectionItem(section.id, proj.id, { name: e.target.value })} />
                                            <Input label="Technologies" name="technologies" value={proj.technologies} onChange={e => updateSectionItem(section.id, proj.id, { technologies: e.target.value })} />
                                            <Input label="Date" name="date" value={proj.date} onChange={e => updateSectionItem(section.id, proj.id, { date: e.target.value })} />
                                            <Textarea label="Description" name="description" value={proj.description} onChange={e => updateSectionItem(section.id, proj.id, { description: e.target.value })} />
                                        </div>
                                    ))}
                                    <button onClick={() => addSectionItem(section.id, { id: uuidv4(), name: '', technologies: '', date: '', description: '' } as ProjectItem)} className="flex items-center space-x-2 text-violet-400 font-semibold text-sm hover:text-violet-300"><PlusIcon className="h-5 w-5" /><span>Add Project</span></button>
                                </>
                            );
                        case 'skills':
                             return (
                                <>
                                    {section.items.map(skill => (
                                        <div key={skill.id} className="p-4 border border-slate-700 rounded-lg space-y-3 relative">
                                            <button onClick={() => deleteSectionItem(section.id, skill.id)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>
                                            <Input label="Skill Category" name="type" value={skill.type} onChange={e => updateSectionItem(section.id, skill.id, { type: e.target.value })} />
                                            <Input label="Skills List (comma-separated)" name="list" value={skill.list} onChange={e => updateSectionItem(section.id, skill.id, { list: e.target.value })} />
                                        </div>
                                    ))}
                                    <button onClick={() => addSectionItem(section.id, { id: uuidv4(), type: '', list: ''} as SkillItem)} className="flex items-center space-x-2 text-violet-400 font-semibold text-sm hover:text-violet-300"><PlusIcon className="h-5 w-5" /><span>Add Skill Category</span></button>
                                </>
                            );
                        case 'leadership':
                            return (
                                <>
                                    {section.items.map(lead => (
                                        <div key={lead.id} className="p-4 border border-slate-700 rounded-lg space-y-3 relative">
                                            <button onClick={() => deleteSectionItem(section.id, lead.id)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>
                                            <Input label="Organization" name="organization" value={lead.organization} onChange={e => updateSectionItem(section.id, lead.id, { organization: e.target.value })} />
                                            <Input label="Role" name="role" value={lead.role} onChange={e => updateSectionItem(section.id, lead.id, { role: e.target.value })} />
                                            <Input label="Date" name="date" value={lead.date} onChange={e => updateSectionItem(section.id, lead.id, { date: e.target.value })} />
                                            <Textarea label="Description" name="description" value={lead.description} onChange={e => updateSectionItem(section.id, lead.id, { description: e.target.value })} />
                                        </div>
                                    ))}
                                    <button onClick={() => addSectionItem(section.id, { id: uuidv4(), organization: '', role: '', date: '', description: '' } as LeadershipItem)} className="flex items-center space-x-2 text-violet-400 font-semibold text-sm hover:text-violet-300"><PlusIcon className="h-5 w-5" /><span>Add Leadership</span></button>
                                </>
                            );
                        case 'coursework':
                        case 'customText':
                            return (
                                <Textarea label="Content" name="content" value={section.content} onChange={e => updateSection(section.id, { content: e.target.value })} rows={4} />
                            );
                        default:
                            return null;
                     }
                   })()}
                </SectionContainer>
            ))}

            <div className="pt-4 border-t border-slate-800">
                <h3 className="font-semibold text-slate-300 mb-2">Add New Section</h3>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => addSection('experience')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Experience</button>
                    <button onClick={() => addSection('projects')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Projects</button>
                    <button onClick={() => addSection('education')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Education</button>
                    <button onClick={() => addSection('skills')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Skills</button>
                    <button onClick={() => addSection('leadership')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Leadership</button>
                    <button onClick={() => addSection('coursework')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Coursework</button>
                    <button onClick={() => addSection('customText')} className="px-3 py-1 bg-slate-700 text-slate-200 text-sm rounded-lg hover:bg-slate-600">Custom Text</button>
                </div>
            </div>
        </div>
    );
};