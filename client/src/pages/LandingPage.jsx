import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, Zap, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-sans">
      {/* Background blur effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">ResumeMatch<span className="text-blue-500">AI</span></span>
        </div>
        <div>
          <Link to="/dashboard" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center justify-center mb-8">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
               <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               AI-Powered Career Growth
             </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight mb-8">
            Land Your Dream Job with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Precision Matching
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Upload your resume, compare it against any job description, and get instant AI feedback to optimize your ATS score and get hired faster.
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all">
              Try It Free
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 w-full pb-24 text-left">
          <FeatureCard 
            icon={<FileText className="w-6 h-6 text-blue-400" />}
            title="Instant Analysis"
            desc="Upload PDF or DOCX and get your resume parsed and analyzed against job requirements in seconds."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Search className="w-6 h-6 text-purple-400" />}
            title="Smarter Keywords"
            desc="Discover exact missing keywords that Applicant Tracking Systems look for in your profile."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Briefcase className="w-6 h-6 text-indigo-400" />}
            title="Job Recommendations"
            desc="Get curated job listings that perfectly match your newly optimized profile score."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.06] transition-colors"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6 shadow-inner border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-200">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
