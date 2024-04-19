import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

interface FileSystemItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: currentPath } = req.query;
  const dirPath = path.join(process.cwd(), 'renderer/pages', currentPath as string);

  try {
    const items: FileSystemItem[] = fs.readdirSync(dirPath).map(itemName => {
      const itemPath = path.join(dirPath, itemName);
      const stats = fs.statSync(itemPath);
      return {
        name: itemName.replace(".tsx", ""),
        size: stats.size,
        isDirectory: stats.isDirectory(),
        path: `${currentPath}/${itemName}`
      };
    });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}