import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);
