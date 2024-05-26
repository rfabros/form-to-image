import { readFile } from 'fs/promises';

export async function convertImageToBase64(filePath: string): Promise<string> {
  try {
    const fileBuffer = await readFile(filePath);
    return fileBuffer.toString('base64');
  } catch (error) {
    console.error('Error reading the file:', error);
    throw error;
  }
}

