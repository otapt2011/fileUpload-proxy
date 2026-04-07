import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { file } = req.query;
  if (!file) return res.status(400).json({ error: 'Missing file name' });
  const filePath = path.join('/tmp', file);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.sendFile(filePath);
}
