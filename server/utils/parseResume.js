import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');
const mammothModule = require('mammoth');

const pdf = typeof pdfModule === 'function' ? pdfModule : (pdfModule.default || pdfModule);
const mammoth = typeof mammothModule === 'function' ? mammothModule : (mammothModule.default || mammothModule);

export const parseResume = async (fileBuffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
       const data = await pdf(fileBuffer);
       return data.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
       const result = await mammoth.extractRawText({ buffer: fileBuffer });
       return result.value;
    } else {
       throw new Error('Unsupported file format. Please upload PDF or DOCX.');
    }
  } catch (error) {
     throw new Error('Error parsing file: ' + error.message);
  }
};
