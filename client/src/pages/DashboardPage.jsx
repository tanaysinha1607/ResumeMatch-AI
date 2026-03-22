import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import ResumeUpload from '../components/ResumeUpload';
// Placedholders for next components
import JobMatchResults from '../components/JobMatchResults';
import KeywordSuggestions from '../components/KeywordSuggestions';
import JobRecommendations from '../components/JobRecommendations';

export default function DashboardPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [keywordResult, setKeywordResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText) return toast.error('Please upload your resume first');
    if (!jobDescription) return toast.error('Please paste a job description');

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setKeywordResult(null);
    
    try {
      // Analyze current ATS match
      const analyzeRes = await axios.post('http://localhost:5000/api/analyze', {
        resumeText,
        jobDescription
      });
      
      setAnalysisResult(analyzeRes.data.matchAnalysis);
      setKeywordResult(analyzeRes.data.keywordSuggestions);

      // Fetch curated job recommendations
      const recRes = await axios.post('http://localhost:5000/api/jobs/recommend', {
        resumeText
      });
      setRecommendations(recRes.data.recommendations);
      
      toast.success('Analysis complete!');
      
    } catch (error) {
      toast.error('Failed to analyze match');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Zap className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">ResumeMatch<span className="text-blue-600">AI</span></span>
          </Link>
          <Link to="/" className="text-sm font-medium text-slate-500 flex items-center gap-1 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">1. Upload Resume</h2>
              <ResumeUpload onUploadSuccess={(text) => setResumeText(text)} />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold mb-6 text-slate-800">2. Job Description</h2>
              <textarea 
                className="w-full h-48 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all placeholder:text-slate-400"
                placeholder="Paste the target job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText || !jobDescription}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </>
              ) : (
                'Analyze Match'
              )}
            </button>
          </div>
          
          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {!analysisResult && !isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center"
                >
                  <Zap className="w-12 h-12 mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Ready for Analysis</h3>
                  <p className="max-w-xs">Upload your resume and paste a job description to see your ATS match score, missing keywords, and recommended roles.</p>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="h-full min-h-[400px] border border-slate-100 bg-white rounded-3xl flex flex-col items-center justify-center text-slate-500 shadow-sm"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                  <p className="font-medium">AI is reviewing your profile...</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-8 h-full"
                >
                  <JobMatchResults data={analysisResult} />
                  <KeywordSuggestions data={keywordResult} />
                  <JobRecommendations jobs={recommendations} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
