import formidable from 'formidable-serverless';
import fs from 'fs';
import path from 'path';

export const config = {
  api: { bodyParser: false }, // disable default body parser for file uploads
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = new formidable.IncomingForm();
  form.uploadDir = '/tmp';
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const file = files.file || Object.values(files)[0];
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Return file info (in production, upload to S3 and return URL)
    const fileInfo = {
      originalName: file.originalFilename,
      size: file.size,
      mimetype: file.mimetype,
      tempPath: file.filepath,
      downloadUrl: `/api/download?file=${encodeURIComponent(path.basename(file.filepath))}`
    };
    res.status(200).json({ success: true, file: fileInfo });
  });
}
