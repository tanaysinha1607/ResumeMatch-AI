import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export const analyzeResumeMatch = async (resumeText, jobDescription) => {
  if (!genAI) {
    return {
      match_percentage: Math.floor(Math.random() * 40) + 50,
      matching_keywords: ['JavaScript', 'React', 'Frontend'],
      missing_keywords: ['Node.js', 'MongoDB', 'AWS'],
      summary: "This is a mock summary because the Gemini API key is missing. Please add your key to the .env file to see real results."
    };
  }

  const prompt = `You are an ATS (Applicant Tracking System).
Compare the following RESUME and JOB DESCRIPTION.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Tasks:
1. Calculate a match percentage (0–100%)
2. List matching skills/keywords
3. List missing skills/keywords
4. Give a short explanation of the score

Output ONLY valid JSON format exactly like this, without any markdown formatting blocks:
{
  "match_percentage": number,
  "matching_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword3", "keyword4"],
  "summary": "Short explanation"
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Analysis):", error.message);
    return {
      match_percentage: Math.floor(Math.random() * 40) + 50,
      matching_keywords: ['JavaScript', 'React', 'Frontend'],
      missing_keywords: ['Node.js', 'MongoDB', 'AWS'],
      summary: "Gemini AI check failed. The application gracefully fell back to displaying these mock AI results so you can continue testing the UI!"
    };
  }
};

export const suggestKeywords = async (resumeText, jobDescription) => {
  if (!genAI) {
    return { 
      important_keywords: ['React', 'Node.js', 'MongoDB'], 
      missing_keywords: ['Node.js', 'MongoDB'], 
      recommended_keywords: ['Add backend experience', 'Mention database design'] 
    };
  }

  const prompt = `You are an expert ATS resume optimizer.
Given the JOB DESCRIPTION and RESUME below:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Identify:
1. Important keywords in the job description
2. Missing keywords in the resume
3. Suggest keywords to add to improve ATS score

Return ONLY valid JSON format exactly like this, without any markdown formatting blocks:
{
  "important_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword3"],
  "recommended_keywords": ["keyword3", "keyword4"]
}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Keywords):", error.message);
    return { 
      important_keywords: ['React', 'Node.js', 'MongoDB'], 
      missing_keywords: ['Node.js', 'MongoDB'], 
      recommended_keywords: ['Add backend experience', 'Mention database design'] 
    };
  }
};
