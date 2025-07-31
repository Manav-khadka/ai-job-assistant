# Intelligent Job Application Assistant

A sophisticated web application designed to empower job seekers by creating a comprehensive, AI-generated "application kit" tailored to a specific job description. This tool goes beyond simple cover letters, providing users with a suite of materials to help them prepare, apply, and interview with confidence.

![Intelligent Job Application Assistant Screenshot](https://user-images.githubusercontent.com/158752/236021200-008a2020-0020-4b2a-8b02-861f1c64222f.png)

---

## ✨ Key Features

*   **Multi-Resume Management**:
    *   Add resumes by pasting raw text or **uploading a PDF**.
    *   Save, name, and manage multiple resume versions.
    *   All data is stored securely in the browser's local storage.
*   **AI-Powered Application Kit Generation**: Provides a complete set of assets from a single click.
*   **Tabbed Output for Clarity**: All generated assets are organized into a clean, intuitive tabbed interface.
*   **The Generated Kit Includes**:
    1.  **Short & Engaging Email**: A concise, professionally written email designed to catch a recruiter's eye.
    2.  **Full Cover Letter**: A detailed, multi-paragraph cover letter that aligns your resume with the job's key requirements.
    3.  **Interview Q&A**: A list of 7-10 common behavioral questions with tailored answers based on your resume.
    4.  **Web-Sourced DSA Questions**: A comprehensive list of **20-40** frequently asked Data Structures & Algorithms questions, compiled by searching the web for relevant problems for that specific role and company. Each question includes:
        *   A high-level explanation of the optimal approach.
        *   A direct **practice link** to search for the problem on LeetCode.
    5.  **Real Interview Experiences**: Uses Google Search to find and link to relevant blog posts, articles, and forum discussions about real-world interview experiences for the target company and role.

## 🛠️ Technology Stack & Approach

This application is built with a modern frontend stack and leverages the power of the Google Gemini API for its intelligent features.

*   **Frontend**:
    *   **React 19**: For building a reactive and component-based user interface.
    *   **TypeScript**: For type safety and improved developer experience.
    *   **Tailwind CSS**: For rapid, utility-first styling.
*   **AI Engine**:
    *   **Google Gemini API (`@google/genai`)**: The core of the application, using the `gemini-2.5-flash` model.
*   **File Handling**:
    *   **`pdfjs-dist`**: Used for robust, client-side extraction of text content from uploaded PDF resumes.

### Architectural Approach

The application's core logic resides in `services/geminiService.ts`, which orchestrates multiple, parallel API calls to the Gemini API to efficiently generate the full application kit.

1.  **Structured Content Generation**: A single API call generates the Email, Cover Letter, and Q&A. This is achieved by providing a rigid `responseSchema` to the `generateContent` method, ensuring the AI returns a predictable, parseable JSON object.

2.  **Web-Sourced Interview Experiences**: A second, parallel API call uses the `googleSearch` tool available in the Gemini API. It queries the web for relevant interview experiences based on the job description and returns a list of curated links.

3.  **Advanced DSA Question Compilation**: A sophisticated two-step process generates the DSA questions:
    *   **Step 1 (Search)**: An initial API call uses the `googleSearch` tool to find a collection of web pages (articles, forums like LeetCode, etc.) that discuss common coding interview questions for the specified role.
    *   **Step 2 (Synthesize)**: The content from these search results is then fed into a second API call. This call has a specific prompt instructing the AI to act as an expert hiring manager, synthesize the provided information, and extract a comprehensive list of 20-40 of the most frequently mentioned DSA problems, complete with approaches and practice links.

This multi-call, parallel architecture ensures that the application is both fast and robust, as a failure in one of the optional calls (like web search) does not prevent the core assets from being generated.

---

## 🚀 Getting Started

To run this project locally, follow these steps.

### Prerequisites

*   A modern web browser.
*   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/intelligent-job-assistant.git
    cd intelligent-job-assistant
    ```

2.  **Configure API Key:**
    The application is configured to use an environment variable for the API key. You will need to set this up. The simplest way is to use a tool that can serve the project while managing environment variables.

    For example, using `vite`:
    *   Install Vite: `npm install -g vite`
    *   Create a file named `.env` in the project root.
    *   Add your API key to the `.env` file:
        ```
        VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    *   Update `services/geminiService.ts` to use `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY`.

3.  **Run the application:**
    *   If using Vite, run `vite` in the project directory.
    *   Alternatively, you can use any local web server. Make sure it can serve the `index.html` file correctly. The app uses ES modules and an `importmap`, so it should run in any modern browser that can access the internet for CDN dependencies.

---

## 📂 File Structure

The project is organized into a `components` directory for reusable UI elements, a `services` directory for API interactions, and a `hooks` directory for custom React hooks.

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── icons/            # SVG icon components
│   │   ├── common/           # Common components like Spinner
│   │   ├── AddResumeModal.tsx
│   │   ├── GeneratorControls.tsx
│   │   ├── Header.tsx
│   │   ├── OutputDisplay.tsx
│   │   └── ResumeManager.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts  # Hook for persisting state
│   ├── services/
│   │   └── geminiService.ts    # Core AI logic and API calls
│   ├── App.tsx               # Main application component
│   └── index.tsx             # React entry point
├── .gitignore
├── index.html                # Main HTML file with importmap
├── package.json
└── README.md
```