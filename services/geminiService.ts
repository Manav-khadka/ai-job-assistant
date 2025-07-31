
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("The API_KEY environment variable is missing. Please configure it to use the AI features.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface QAndA {
  question: string;
  answer: string;
}

export interface DsaQuestion {
  question: string;
  approach: string;
  practiceLink: string;
}

export interface InterviewExperience {
  uri: string;
  title: string;
}

export interface GeneratedAssets {
  email: string;
  coverLetter: string;
  qAndA: QAndA[];
  dsaQuestions?: DsaQuestion[];
  experiences?: InterviewExperience[];
}

export interface AnalysisResult {
  overallImpression: string;
  formattingAndReadability: string;
  impactAndActionVerbs: string;
  contactInfoFeedback: string;
  experienceSectionFeedback: string;
  skillsSectionFeedback: string;
  projectsSectionFeedback: string;
  educationSectionFeedback: string;
  score?: number;
  keywords?: {
    present: string[];
    missing: string[];
  };
  atsFriendliness?: {
    score: number;
    feedback: string;
  };
}

export type ExperienceLevel = 'fresher' | 'mid-level' | 'senior';


const structuredContentSchema = {
  type: Type.OBJECT,
  properties: {
    email: {
      type: Type.STRING,
      description: "A short, engaging, and professional email (100-150 words). Use `\n\n` for paragraph breaks. Emphasize key skills matching the job description by wrapping them in double asterisks, like **this**. Must end with a professional closing."
    },
    coverLetter: {
      type: Type.STRING,
      description: "A professional cover letter (3-4 paragraphs). Use `\n\n` for paragraph breaks. Emphasize key achievements matching the job description by wrapping them in double asterisks, like **this**. Must end with a professional closing."
    },
    qAndA: {
      type: Type.ARRAY,
      description: "An array of 7-10 common interview questions with answers based on the resume. Answers should be concise and use the STAR method where appropriate.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"]
      }
    }
  },
  required: ["email", "coverLetter", "qAndA"]
};


async function generateDsaQuestions(jobDescription: string): Promise<DsaQuestion[] | undefined> {
  const dsaSearchPrompt = `Find web pages, articles, and forum discussions (like LeetCode, GeeksforGeeks) listing frequently asked coding interview questions for a role described as: "${jobDescription}"`;

  try {
      const searchResult = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: dsaSearchPrompt,
          config: { tools: [{ googleSearch: {} }] },
      });

      const groundingChunks = searchResult?.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (!groundingChunks || groundingChunks.length === 0) {
          console.warn("DSA web search returned no results. Cannot compile questions.");
          return undefined;
      }

      const context = groundingChunks
          .map((chunk: any) => `Source: ${chunk.web?.title || 'Untitled'}\nContent:\n${chunk.web?.snippet || ''}`)
          .join('\n\n---\n\n');

      const dsaCompilationPrompt = `
          You are an expert software engineering hiring manager.
          Based on the following web search results about common interview questions for a specific job, synthesize a comprehensive list of 20 to 40 of the most frequently mentioned Data Structures and Algorithms (DSA) questions.
          Prioritize questions that appear to be repeated across multiple sources. For each question, provide a brief, high-level explanation of the optimal approach.
          For each question, also provide a "practiceLink" which is a URL to search for that specific problem on LeetCode. The URL should be in the format: \`https://leetcode.com/problemset/?search=YOUR_QUESTION_HERE\`, with spaces in the question replaced by \`%20\`.
          Adhere strictly to the JSON schema provided. Your output must be a valid JSON object.

          --- WEB SEARCH RESULTS ---
          ${context}

          --- JOB DESCRIPTION ---
          ${jobDescription}
      `;

      const dsaSchema = {
          type: Type.OBJECT,
          properties: {
            dsaQuestions: {
              type: Type.ARRAY,
              description: "A comprehensive list of 20 to 40 frequently asked Data Structures and Algorithms (DSA) questions, synthesized from web search results relevant to the job description. For each, provide a brief explanation of the optimal approach and a LeetCode practice link.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The DSA question." },
                  approach: { type: Type.STRING, description: "A brief explanation of the optimal approach to solve it." },
                  practiceLink: { type: Type.STRING, description: "A URL to search for the problem on LeetCode." }
                },
                required: ["question", "approach", "practiceLink"]
              }
            }
          },
          required: ["dsaQuestions"]
      };

      const compilationResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: dsaCompilationPrompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: dsaSchema,
          }
      });
      
      const dsaJsonText = compilationResult.text.trim();
      const parsedDsaData = JSON.parse(dsaJsonText);
      if (Array.isArray(parsedDsaData.dsaQuestions)) {
          return parsedDsaData.dsaQuestions;
      }
      return undefined;
  } catch (e) {
      console.error("DSA generation process failed:", e);
      // Returning undefined to indicate failure, so the main process can continue.
      return undefined; 
  }
}

export async function generateRecruitmentAssets(resume: string, jobDescription: string): Promise<GeneratedAssets> {
  const structuredContentPrompt = `
    You are an expert career coach and professional writer. Your task is to generate a suite of job application materials.
    Analyze the provided RESUME and JOB DESCRIPTION.
    Generate three assets: 1) a short application email, 2) a professional cover letter, and 3) a set of 7-10 interview questions with answers.
    
    Formatting rules:
    - For the email and cover letter, use '\\n\\n' for paragraph breaks.
    - To emphasize key skills or experiences that directly match the job description, wrap them in double asterisks, like **this**.
    - Adhere strictly to the JSON schema. Do not include any introductory text or markdown formatting in your response.

    --- RESUME ---
    ${resume}

    --- JOB DESCRIPTION ---
    ${jobDescription}
  `;
  
  const searchPrompt = `Based on the following job description, find relevant links to articles, blog posts, or forum discussions about interview experiences for this role or company.\n\n--- JOB DESCRIPTION ---\n${jobDescription}`;
  
  try {
    const structuredContentPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: structuredContentPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: structuredContentSchema,
        }
    });

    const searchPromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: searchPrompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    }).catch(e => {
        console.warn("Web search for experiences failed, continuing without them.", e);
        return null;
    });

    const dsaPromise = generateDsaQuestions(jobDescription);

    const [structuredResult, searchResult, dsaQuestions] = await Promise.all([
      structuredContentPromise, 
      searchPromise, 
      dsaPromise
    ]);

    // Process structured data
    const jsonText = structuredResult.text.trim();
    const parsedData = JSON.parse(jsonText);

    if (!parsedData.email || !parsedData.coverLetter || !Array.isArray(parsedData.qAndA)) {
      console.error("AI response for structured data was invalid:", jsonText);
      throw new Error("AI response for structured content is missing required fields.");
    }
    
    // Process search data
    const groundingChunks = searchResult?.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const experiences: InterviewExperience[] = groundingChunks
      ?.map((chunk: any) => chunk.web)
      ?.filter((web: any) => web && web.uri && web.title) || [];
    
    return {
      ...(parsedData as Omit<GeneratedAssets, 'experiences' | 'dsaQuestions'>),
      dsaQuestions,
      experiences,
    };

  } catch (error) {
    console.error("Error generating recruitment assets:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the AI's response. The format was invalid.");
    }
    if (error instanceof Error) {
      if(error.message.includes('API key not valid')) {
          throw new Error('The provided API Key is not valid. Please check your configuration.');
      }
      throw new Error(`Failed to generate assets from AI: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the AI service.");
  }
}

const buildAnalysisSchema = (isTargeted: boolean) => {
    const baseProperties: any = {
        overallImpression: { type: Type.STRING, description: "A paragraph providing a high-level summary of the resume's strengths and weaknesses for the specified experience level." },
        formattingAndReadability: { type: Type.STRING, description: "A paragraph providing feedback on the resume's layout, font choices, spacing, and overall clarity." },
        impactAndActionVerbs: { type: Type.STRING, description: "A paragraph analyzing the use of action verbs. Provide specific 'before' and 'after' examples to improve impact." },
        contactInfoFeedback: { type: Type.STRING, description: "A paragraph providing feedback on the contact information section, suggesting additions like a portfolio or noting any missing key info." },
        experienceSectionFeedback: { type: Type.STRING, description: "A paragraph critiquing the Experience section. Focus on whether achievements are quantified and results-oriented. Provide examples for improvement." },
        skillsSectionFeedback: { type: Type.STRING, description: "A paragraph analyzing the skills section. Comment on its organization and relevance for the specified experience level." },
        projectsSectionFeedback: { type: Type.STRING, description: "A paragraph providing feedback on the Projects section. Are the projects relevant? Is the technology stack clear? Are the descriptions impactful?" },
        educationSectionFeedback: { type: Type.STRING, description: "A paragraph providing feedback on the Education section, noting its placement and relevance for the specified experience level." },
    };

    let finalProperties = { ...baseProperties };
    let requiredFields = [...Object.keys(baseProperties)];

    if (isTargeted) {
        finalProperties.score = { type: Type.INTEGER, description: "An integer score from 0 to 100 representing how well the resume is tailored to the job description." };
        finalProperties.keywords = {
            type: Type.OBJECT,
            properties: {
                present: { type: Type.ARRAY, description: "An array of important keywords from the job description found in the resume.", items: { type: Type.STRING } },
                missing: { type: Type.ARRAY, description: "An array of crucial keywords from the job description MISSING from the resume.", items: { type: Type.STRING } }
            },
            required: ["present", "missing"]
        };
        requiredFields.push('score', 'keywords');
    } else {
        finalProperties.atsFriendliness = {
            type: Type.OBJECT,
            description: "An analysis of the resume's compatibility with Applicant Tracking Systems (ATS).",
            properties: {
                score: { type: Type.INTEGER, description: "An integer score from 0 to 100 representing how ATS-friendly the resume is, based on its structure, formatting, and keyword usage." },
                feedback: { type: Type.STRING, description: "A detailed paragraph explaining the ATS score. Provide actionable advice on how to improve parsability, such as using standard section titles, avoiding complex layouts, and ensuring key information is easily machine-readable." }
            },
            required: ["score", "feedback"]
        };
        requiredFields.push('atsFriendliness');
    }

    return { type: Type.OBJECT, properties: finalProperties, required: requiredFields };
};

export async function analyzeResume(
    resume: string, 
    experienceLevel: ExperienceLevel, 
    jobDescription?: string | null
): Promise<AnalysisResult> {
    const isTargetedAnalysis = !!jobDescription;

    const analysisPrompt = `
      You are an expert career coach and resume analyst with years of experience helping candidates at all levels (from fresher to senior) land jobs at top tech companies.
      
      Your task is to provide a detailed, objective analysis of the provided RESUME. 
      The candidate has specified their experience level as: **${experienceLevel.toUpperCase()}**. All of your feedback must be tailored to the expectations for this level.

      ${isTargetedAnalysis 
        ? `This is a TARGETED analysis against the provided JOB DESCRIPTION. You must provide a tailoring score and keyword analysis.`
        : `This is a GENERAL analysis. Focus on the overall quality of the resume for the candidate's experience level. You MUST provide an ATS Friendliness score and detailed feedback on the resume's parsability, structure, and keyword usage for automated screening systems.`
      }
      
      Your analysis must be critical, constructive, and strictly follow the provided JSON schema. Do not include any introductory text or markdown formatting.

      --- RESUME ---
      ${resume}

      ${isTargetedAnalysis ? `--- JOB DESCRIPTION ---\n${jobDescription}` : ''}
    `;

    const schema = buildAnalysisSchema(isTargetedAnalysis);

    try {
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: analysisPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });

        const jsonText = result.text.trim();
        const parsedData = JSON.parse(jsonText) as AnalysisResult;

        if (!parsedData.overallImpression) {
            console.error("AI response for analysis was invalid:", jsonText);
            throw new Error("AI analysis response is missing required fields.");
        }

        return parsedData;

    } catch (error) {
        console.error("Error analyzing resume:", error);
        if (error instanceof SyntaxError) {
            throw new Error(`The AI's analysis response was not valid JSON.`);
        }
        if (error instanceof Error) {
            if (error.message.includes('API key not valid')) {
                throw new Error('The provided API Key is not valid. Please check your configuration.');
            }
            throw new Error(`Failed to get analysis from AI: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during resume analysis.");
    }
}