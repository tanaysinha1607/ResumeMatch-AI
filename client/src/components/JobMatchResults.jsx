import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Activity } from 'lucide-react';

export default function JobMatchResults({ data }) {
  if (!data) return null;
  const { match_percentage, matching_keywords, missing_keywords, summary } = data;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500 bg-green-500';
    if (score >= 50) return 'text-yellow-500 bg-yellow-500';
    return 'text-red-500 bg-red-500';
  };

  const colorClass = getScoreColor(match_percentage);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-blue-500" /> Match Analysis
        </h2>
        <div className="flex items-end gap-1">
          <span className={`text-4xl font-extrabold ${colorClass.split(' ')[0]}`}>{match_percentage}%</span>
          <span className="text-slate-500 font-medium mb-1 border-b-2 border-slate-200">Match</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${match_percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass.split(' ')[1]}`}
        />
      </div>

      <p className="text-slate-600 leading-relaxed mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        {summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border border-green-100 bg-green-50/30">
          <h4 className="flex items-center gap-2 font-semibold text-green-700 mb-3"><CheckCircle2 className="w-5 h-5"/> Matches</h4>
          <div className="flex flex-wrap gap-2">
            {matching_keywords?.map((kw, i) => (
              <span key={i} className="px-2.5 py-1 text-sm rounded-md bg-green-100/50 text-green-700 font-medium">{kw}</span>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-red-100 bg-red-50/30">
          <h4 className="flex items-center gap-2 font-semibold text-red-700 mb-3"><XCircle className="w-5 h-5"/> Missing</h4>
          <div className="flex flex-wrap gap-2">
            {missing_keywords?.map((kw, i) => (
              <span key={i} className="px-2.5 py-1 text-sm rounded-md bg-red-100/50 text-red-700 font-medium">{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
