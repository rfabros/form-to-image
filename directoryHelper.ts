import { readdir, writeFile } from 'fs/promises';

export async function listFilesInFolder(folderPath: string): Promise<string[]> {
  try {
    const filesInFolder = await readdir(folderPath, { withFileTypes: true });
    const fileNames = filesInFolder
      .filter(dirent => dirent.isFile())
      .map(dirent => dirent.name);
    
    return fileNames;
  } catch (error) {
    console.error('Error reading the folder:', error);
    throw error;
  }
}

export async function writeStringToFile(filePath: string, content: string): Promise<void> {
    try {
      await writeFile(filePath, content, 'utf8');
      console.log(`File has been written successfully to ${filePath}`);
    } catch (error) {
      console.error('Error writing to the file:', error);
      throw error;
    }
  }