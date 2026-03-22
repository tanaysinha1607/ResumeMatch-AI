import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for now to allow anonymous uploads
  resumeText: { type: String, required: true },
  parsedData: { type: Object },
}, { timestamps: true });

export default mongoose.model('Resume', ResumeSchema);
