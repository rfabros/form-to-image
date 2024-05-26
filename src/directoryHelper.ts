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

export function generateDateSuffix(): string {
    const now = new Date();
    const isoString = now.toISOString(); // Get the ISO string
    const formattedDate = isoString.replace(/:/g, '-').split('.')[0]; // Replace colons and remove milliseconds
    return formattedDate;
}