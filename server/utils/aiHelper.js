import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export const analyzeResumeMatch = async (resumeText, jobDescription) => {
  if (!groq) {
    return {
      match_percentage: Math.floor(Math.random() * 40) + 50,
      matching_keywords: ['JavaScript', 'React', 'Frontend'],
      missing_keywords: ['Node.js', 'MongoDB', 'AWS'],
      summary: "This is a mock summary because the Groq API key is missing. Please add your key to the .env file to see real results."
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
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    
    const responseText = result.choices[0]?.message?.content || "{}";
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Groq API Error (Analysis):", error.message);
    return {
      match_percentage: Math.floor(Math.random() * 40) + 50,
      matching_keywords: ['JavaScript', 'React', 'Frontend'],
      missing_keywords: ['Node.js', 'MongoDB', 'AWS'],
      summary: "Groq AI check failed (likely rate limit or network issue). Displaying mock results so you can continue testing the UI!"
    };
  }
};

export const suggestKeywords = async (resumeText, jobDescription) => {
  if (!groq) {
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
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const responseText = result.choices[0]?.message?.content || "{}";
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Groq API Error (Keywords):", error.message);
    return { 
      important_keywords: ['React', 'Node.js', 'MongoDB'], 
      missing_keywords: ['Node.js', 'MongoDB'], 
      recommended_keywords: ['Add backend experience', 'Mention database design'] 
    };
  }
};
