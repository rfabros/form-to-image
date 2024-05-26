import OpenAI from 'openai';
import path from 'path';
import { generateDateSuffix, listFilesInFolder } from './directoryHelper';
import { writeFile } from 'fs/promises';
import { convertImageToBase64 } from './fileEncoder';

export async function generateHtml() {
    const openai = new OpenAI();
    const folderPath = path.join(__dirname, 'input-files'); // Replace with your folder path

    try {
        const fileNames = await listFilesInFolder(folderPath);
        console.log('Files in folder:', fileNames);

        if (fileNames.length !== 1) {
            throw new Error("input-files must only have 1 image file");
        }

        const imagePath = path.join(folderPath, fileNames[0]);
        const base64String = await convertImageToBase64(imagePath);
        console.log('Converted', imagePath);

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'user', content: 'Can you create an html of this form? break it up into sections.' },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/jpeg;base64,${base64String}`
                            }
                        }
                    ]
                }
            ]
        });

        const content = completion.choices[0]?.message?.content;
        console.log(`chat ${completion.id} responded.`);

        if (!content) {
            throw new Error('Response content is null or undefined.');
        }

        const filePath = path.join(__dirname, 'temp-responses', `${generateDateSuffix()}.txt`);
        await writeFile(filePath, content);

        return filePath;
    } catch (error) {
        console.error('Error:', error);
    }
}
