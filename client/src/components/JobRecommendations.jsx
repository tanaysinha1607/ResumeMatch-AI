import React from 'react';
import { Briefcase, ExternalLink, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function JobRecommendations({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  const handleApply = async (jobId, matchScore) => {
    try {
      const response = await axios.post('http://localhost:5000/api/apply', { jobId, matchScore });
      toast.success(response.data.message || 'Applied successfully!');
    } catch {
      toast.error('Failed to apply. Check server.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
        <Briefcase className="text-blue-500" /> Recommended Jobs
      </h2>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group bg-slate-50/50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-slate-500 font-medium">{job.company}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">{job.matchScore}% Match</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mt-3 line-clamp-2">{job.description}</p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => handleApply(job._id, job.matchScore)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> 1-Click Apply
              </button>
              <button
                onClick={() => {
                  if (job.link && job.link !== '#') {
                    window.open(job.link, '_blank', 'noreferrer');
                  } else {
                    toast('External link not available for this mock job', { icon: 'ℹ️' });
                  }
                }}
                className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                View <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
