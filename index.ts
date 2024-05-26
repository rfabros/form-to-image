#!/usr/bin/env -S npm run tsn -T

import OpenAI from 'openai';
import path from 'path';
import { listFilesInFolder, writeStringToFile } from './directoryHelper';
import { convertImageToBase64 } from './fileEncoder';

// gets API Key from environment variable OPENAI_API_KEY
const openai = new OpenAI();

async function main() {
  const folderPath = path.join(__dirname, 'input-files'); // Replace with your folder path
  let fileNames: string[] = [];

  try {
    fileNames = await listFilesInFolder(folderPath);
    console.log('Files in folder:', fileNames);
  } catch (error) {
    console.error('Error listing files in folder:', error);
    throw error;
  }

  const imagesInBase64: string[] = [];
  for (const fileName in fileNames) {
    const imagePath = path.join(__dirname, 'input-files', fileName); // Replace with your image file path
    try {
      const base64String = await convertImageToBase64(imagePath);
      imagesInBase64.push(base64String);
      console.log('converted ', imagePath);
    } catch (error) {
      console.error('Error converting image to Base64:', error);
      throw error;
    }
  }

  if(imagesInBase64.length!=1){
    throw Error("input-files must only have 1 image file");
  }

  // Non-streaming:
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Can you create an html of this form? break it up into sections.' },
    {
      role: "user",
      content: [
          {
              type: "image_url",
              image_url: {
                  url: `data:image/jpeg;base64,${imagesInBase64[0]}`
              }
          },
      ],
  }
    ],
  });

  const content = completion.choices[0]?.message?.content;
  console.log(`chat ${completion.id} responded.`);
  
  const filePath = path.join(__dirname, `${completion.id}.txt`); // Replace with your desired file path

  try {
    if(!content){
      throw new Error("Response content is null or undefined.")
    }
    await writeStringToFile(filePath, content);
  } catch (error) {
    console.error('Error in writing string to file:', error);
  }
}

main();