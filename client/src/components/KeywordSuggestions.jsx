import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function KeywordSuggestions({ data }) {
  if (!data) return null;
  const { recommended_keywords } = data;

  if (!recommended_keywords || recommended_keywords.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-[0_10px_40px_-15px_rgba(99,102,241,0.5)] border border-indigo-400/30 text-white">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-300 fill-yellow-300 w-6 h-6" /> Resume Optimization Tips
      </h2>
      <p className="text-indigo-100 mb-5">Adding these keywords contextually to your work experience can significantly boost your ATS ranking for this role:</p>
      
      <div className="flex flex-wrap gap-3">
        {recommended_keywords.map((kw, i) => (
          <span key={i} className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm border border-white/20 shadow-sm text-sm font-medium">
            + {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
