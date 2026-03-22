# ResumeMatch-AI

📌 Overview

ResumeMatch AI is a full-stack web application that helps users evaluate how well their resume matches a specific job description. It uses AI to generate a match score, identify missing keywords, and suggest improvements to increase the chances of passing ATS (Applicant Tracking Systems).

Additionally, the platform recommends relevant jobs from multiple sources based on the user’s resume.

🎯 Key Features
📄 Resume Upload & Parsing

Upload resumes in PDF/DOCX format

Automatically extracts:

Skills

Experience

Education

Keywords

📊 Resume vs Job Match Score

Compare resume with job description

Get:

✅ Match percentage (0–100%)

✅ Matching keywords

❌ Missing keywords

🧠 AI-generated summary

🔑 Keyword Suggestion Engine

Scans job description

Identifies:

Important keywords

Missing keywords in resume

Suggests keywords to improve ATS score

🔍 Job Recommendation System

Finds relevant jobs based on resume

Aggregates jobs from:

LinkedIn

Naukri

Instahyre

Wellfound

Displays:

Job title

Company

Match %

Apply link

🎯 Smart Job Matching

Uses AI / similarity algorithms to:

Rank jobs based on resume fit

Highlight best opportunities

📥 Apply to Jobs

Redirects to original job portal

Tracks applied jobs (optional feature)

🛠️ Tech Stack
Frontend

React.js

Tailwind CSS (optional)

Backend

Node.js

Express.js

Database

MongoDB (MongoDB Atlas)

AI Integration

OpenAI API

File Processing

pdf-parse (PDF)

mammoth.js (DOCX)

Optional Tools

Puppeteer (for scraping jobs)

Axios (API calls)

🧠 How It Works

User uploads resume

User pastes job description

AI analyzes both inputs

System returns:

Match score

Keyword insights

Suggestions

Platform recommends relevant jobs

User applies directly via links
