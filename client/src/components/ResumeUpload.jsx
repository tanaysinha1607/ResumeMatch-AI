import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResumeUpload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData);
      toast.success('Resume parsed successfully!');
      onUploadSuccess(data.text);
    } catch (err) {
      toast.error('Failed to parse resume');
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'], 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] 
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-indigo-100/60 hover:border-blue-400 bg-white shadow-sm'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        {fileName ? (
          <CheckCircle className="w-14 h-14 text-green-500" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-blue-600" />
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {fileName ? `Uploaded: ${fileName}` : 'Upload your Resume'}
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
            {isUploading ? 'Extracting text from document...' : 'Drag & drop your PDF or DOCX here, or click to browse files'}
          </p>
        </div>
      </div>
    </div>
  );
}
