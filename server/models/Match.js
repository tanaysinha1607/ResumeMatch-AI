import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  matchScore: { type: Number, required: true },
  status: { type: String, enum: ['saved', 'applied'], default: 'saved' }
}, { timestamps: true });

export default mongoose.model('Match', MatchSchema);
