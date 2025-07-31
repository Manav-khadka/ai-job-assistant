
import { v4 as uuidv4 } from 'uuid';

export interface PersonalInfo {
    name: string;
    address: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    customLinks: { name: string; url: string; }[];
}

export interface EducationItem {
    id: string; school: string; degree: string; date: string; location: string;
}
export interface ExperienceItem {
    id: string; company: string; role: string; date: string; location: string; description: string;
}
export interface ProjectItem {
    id: string; name: string; technologies: string; date: string; description: string;
}
export interface SkillItem {
    id: string; type: string; list: string;
}
export interface LeadershipItem {
    id: string; organization: string; role: string; date: string; description: string;
}

export type Section = 
    | { id: string; type: 'education'; title: string; items: EducationItem[] }
    | { id: string; type: 'experience'; title: string; items: ExperienceItem[] }
    | { id:string; type: 'projects'; title: string; items: ProjectItem[] }
    | { id:string; type: 'skills'; title: string; items: SkillItem[] }
    | { id:string; type: 'leadership'; title: string; items: LeadershipItem[] }
    | { id:string; type: 'coursework'; title: string; content: string }
    | { id:string; type: 'customText'; title: string; content: string };


export interface ResumeData {
  personalInfo: PersonalInfo;
  sections: Section[];
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: "First Last",
    address: "123 Street Name, Town, State 12345",
    email: "email@gmail.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/username",
    github: "github.com/username",
    customLinks: [
        { name: "LeetCode", url: "https://leetcode.com/username/" },
    ],
  },
  sections: [
    { 
        id: uuidv4(), 
        type: 'education', 
        title: 'Education', 
        items: [
            { id: uuidv4(), school: "State University", degree: "Bachelor of Science in Computer Science", date: "Sep. 2017 – May 2021", location: "City, State" }
        ]
    },
    { 
        id: uuidv4(), 
        type: 'coursework', 
        title: 'Relevant Coursework', 
        content: "Data Structures, Software Methodology, Algorithms Analysis, Database Management, Artificial Intelligence, Internet Technology, Systems Programming, Computer Architecture"
    },
    {
        id: uuidv4(),
        type: 'experience',
        title: 'Experience',
        items: [
            { id: uuidv4(), company: "Electronics Company", role: "Software Engineer Intern", date: "May 2020 – August 2020", location: "City, State", description: "- Developed a service to automatically perform a set of unit tests daily on a product in development in order to decrease time needed for team members to identify and fix bugs/issues.\n- Incorporated scripts using Python and PowerShell to aggregate XML test results into an organized format and to load the latest build code onto the hardware, so that daily testing can be performed.\n- Utilized Jenkins to provide a continuous integration service in order to automate the entire process of loading the latest build code and test files, running the tests, and generating a report of the results once per day." },
            { id: uuidv4(), company: "Startup, Inc", role: "Front End Developer Intern", date: "May 2019 – August 2019", location: "City, State", description: "- Assisted in development of the front end of a mobile application for iOS/Android using Dart and the Flutter framework.\n- Worked with Google Firebase to manage user inputted data across multiple platforms including web and mobile apps." }
        ]
    },
    {
        id: uuidv4(),
        type: 'projects',
        title: 'Projects',
        items: [
            { id: uuidv4(), name: "Gym Reservation Bot", technologies: "Python, Selenium, Google Cloud Console", date: "January 2021", description: "- Developed an automatic bot using Python and Google Cloud Console to register myself for a timeslot at my school gym.\n- Implemented Selenium to create an instance of Chrome in order to interact with the correct elements of the web page." },
            { id: uuidv4(), name: "Ticket Price Calculator App", technologies: "Java, Android Studio", date: "November 2020", description: "- Created an Android application using Java and Android Studio to calculate ticket prices for trips to museums in NYC." }
        ]
    },
    {
        id: uuidv4(),
        type: 'skills',
        title: 'Technical Skills',
        items: [
            { id: uuidv4(), type: "Languages", list: "Python, Java, C, HTML/CSS, JavaScript, SQL" },
            { id: uuidv4(), type: "Developer Tools", list: "VS Code, Eclipse, Google Cloud Platform, Android Studio" },
            { id: uuidv4(), type: "Technologies/Frameworks", list: "Linux, Jenkins, GitHub, JUnit, WordPress" },
        ]
    },
    {
        id: uuidv4(),
        type: 'leadership',
        title: 'Leadership / Extracurricular',
        items: [
            { id: uuidv4(), organization: "Fraternity", role: "President", date: "Spring 2020 – Present", description: "- Achieved a 4 star fraternity ranking by the Office of Fraternity and Sorority Affairs (highest possible ranking).\n- Managed executive board of 5 members and ran weekly meetings to oversee progress in essential parts of the chapter." }
        ]
    }
  ]
};

export const formatResumeDataAsText = (data: ResumeData): string => {
  let text = `Name: ${data.personalInfo.name}\n`;
  text += `Address: ${data.personalInfo.address}\n`;
  
  let contactLine = `Contact: ${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.linkedin} | ${data.personalInfo.github}`;
  data.personalInfo.customLinks?.forEach(link => {
      if (link.name && link.url) {
        contactLine += ` | ${link.name}: ${link.url}`;
      }
  });
  text += contactLine + '\n\n';

  data.sections.forEach(section => {
      text += `--- ${section.title} ---\n`;
      switch(section.type) {
          case 'education':
              section.items.forEach(edu => {
                  text += `${edu.school} (${edu.location}) - ${edu.date}\n`;
                  text += `${edu.degree}\n\n`;
              });
              break;
          case 'experience':
              section.items.forEach(exp => {
                  text += `${exp.company} (${exp.location}) - ${exp.role}, ${exp.date}\n`;
                  text += `${exp.description}\n\n`;
              });
              break;
          case 'projects':
              section.items.forEach(proj => {
                  text += `${proj.name} (${proj.technologies}) - ${proj.date}\n`;
                  text += `${proj.description}\n\n`;
              });
              break;
          case 'skills':
              section.items.forEach(skill => {
                  text += `${skill.type}: ${skill.list}\n`;
              });
              text += "\n";
              break;
          case 'leadership':
              section.items.forEach(lead => {
                  text += `${lead.organization} - ${lead.role}, ${lead.date}\n`;
                  text += `${lead.description}\n\n`;
              });
              break;
          case 'coursework':
          case 'customText':
              text += `${section.content}\n\n`;
              break;
      }
  });

  return text;
};