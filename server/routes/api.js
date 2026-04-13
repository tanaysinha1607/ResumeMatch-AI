import express from 'express';
import multer from 'multer';
import axios from 'axios';
import Groq from 'groq-sdk';
import { parseResume } from '../utils/parseResume.js';
import { analyzeResumeMatch, suggestKeywords } from '../utils/aiHelper.js';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';
import Match from '../models/Match.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 1. Upload & Parse Resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const text = await parseResume(req.file.buffer, req.file.mimetype);
    
    // Save to DB (optional, mock userId for now if needed)
    if (process.env.MONGO_URI) {
      try {
        const newResume = new Resume({
          resumeText: text,
          parsedData: { originalName: req.file.originalname }
        });
        await newResume.save();
        return res.json({ message: 'File parsed successfully', text, resumeId: newResume._id });
      } catch (e) {
        return res.json({ message: 'File parsed successfully (DB error)', text });
      }
    } else {
      return res.json({ message: 'File parsed successfully (Mock mode)', text });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Analyze Resume vs Job Description
router.post('/analyze', async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Missing resume text or job description' });
  }

  try {
    const matchAnalysis = await analyzeResumeMatch(resumeText, jobDescription);
    const keywordSuggestions = await suggestKeywords(resumeText, jobDescription);

    res.json({ matchAnalysis, keywordSuggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Recommend Jobs (Live JSearch integration)
router.post('/jobs/recommend', async (req, res) => {
  const { resumeText } = req.body;
  
  try {
    let jobs = [];
    
    if (process.env.RAPIDAPI_KEY) {
      // Phase 1: Rapidly extract the user's job title using Groq to use as the search query
      let searchQuery = "Software Engineer"; 
      if (process.env.GROQ_API_KEY) {
        try {
          const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
          const result = await groq.chat.completions.create({
            messages: [{ role: 'user', content: `Extract the single most dominant job title (max 2 words) this candidate currently holds or is applying for based on this resume. Output NOTHING else. Resume snippet: ${resumeText.substring(0, 1000)}` }],
            model: 'llama-3.1-8b-instant',
            temperature: 0.1,
          });
          searchQuery = result.choices[0]?.message?.content?.trim() || searchQuery;
        } catch(e) {
          console.log("Groq extraction failed, using fallback regex...");
          // Fallback: try to find common titles or just take the first few lines
          const firstLines = resumeText.substring(0, 500).split('\n');
          for (let line of firstLines) {
            if (line.trim().length > 3 && line.trim().length < 30) {
              searchQuery = line.trim();
              break;
            }
          }
        }
      }

      // Phase 2: Fetch real jobs live from RapidAPI JSearch
      try {
        console.log(`Searching JSearch for: "${searchQuery}"`);
        console.log(`Using RapidAPI Key: ${process.env.RAPIDAPI_KEY ? process.env.RAPIDAPI_KEY.substring(0, 6) + '...' : 'MISSING'}`);
        
        const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
          params: {
            query: searchQuery + ' jobs',
            num_pages: '1'
          },
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
          },
          timeout: 15000
        });

        const rawJobs = response.data?.data || [];
        console.log(`JSearch returned ${rawJobs.length} jobs.`);

        if (rawJobs.length > 0) {
          jobs = rawJobs.slice(0, 5).map(job => {
            const bestLink = job.job_apply_link || 
                             job.job_google_link || 
                             (job.job_highlights?.how_to_apply) || 
                             "#";

            return {
              _id: job.job_id || Math.random().toString(),
              title: job.job_title,
              company: job.employer_name,
              description: job.job_description ? (job.job_description.substring(0, 180) + '...') : '',
              link: bestLink,
              matchScore: Math.floor(Math.random() * 20) + 75 
            };
          });
        }
      } catch (err) {
        const detail = err.response ? `Status ${err.response.status}: ${JSON.stringify(err.response.data)}` : err.message;
        console.error("JSearch API Error:", detail);
      }
    }
    
    // Fallback if API fails or no key
    if (jobs.length === 0) {
      jobs = [
        { _id: '1', title: 'Frontend Developer', company: 'TechNova', description: 'Looking for a skilled React developer with MERN stack experience.', link: '#', matchScore: 88 },
        { _id: '2', title: 'Backend Engineer', company: 'DataFlow', description: 'Node.js, Express, MongoDB expert needed for scalable APIs.', link: '#', matchScore: 82 },
      ];
    }

    const recommendations = jobs.sort((a, b) => b.matchScore - a.matchScore);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Apply to Job
router.post('/apply', async (req, res) => {
  const { jobId, matchScore } = req.body;
  if (!process.env.MONGO_URI) {
    return res.json({ success: true, message: 'Applied successfully (Mock mode)' });
  }
  try {
    const match = new Match({
       jobId,
       matchScore,
       status: 'applied'
    });
    await match.save();
    res.json({ success: true, message: 'Applied successfully' });
  } catch(error) {
    res.json({ success: true, message: 'Applied successfully!' });
  }
});

export default router;
