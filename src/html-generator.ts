import OpenAI from 'openai';
import path from 'path';
import { generateDateSuffix, listFilesInFolder, writeNewResponseHtml } from './directoryHelper';
import { convertImageToBase64 } from './fileEncoder';

export async function generateHtml() {
    const openai = new OpenAI();
    const folderPath = path.join(process.cwd(), 'input-files'); // Replace with your folder path

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
                { role: 'user', content: 'Can you create an html of this form? Make it responsive. And break it up into sections.' },
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
        
        if (!content) {
            throw new Error('Response content is null or undefined.');
        }

        console.log(`chat ${completion.id} responded.`);

        const regex = /```html([\s\S]*?)```/;
        const match = content.match(regex);

        if (match) {
            const html = match?.[1]?.trim();

            if (!html) {
                throw new Error('Response HTML is null or undefined.');
            }

            const filePath = await writeNewResponseHtml(html);
            return filePath;
        }


    } catch (error) {
        console.error('Error:', error);
    }
}

// import OpenAI from 'openai';
// import path from 'path';
// import { generateDateSuffix, listFilesInFolder } from './directoryHelper';
// import { writeFile } from 'fs/promises';
// import { convertImageToBase64 } from './fileEncoder';
// import { ChatCompletionTool } from 'openai/src/resources/chat/completions.js';

// const availableFunctions: ChatCompletionTool[]  = [
//     {
//         type: 'function',
//         function: {
//             name: "get_html",
//             description: "Get the HTML representation of a given form image",
//             parameters: {
//                 type: "object",
//                 properties: {
//                     htmlString: {
//                         type: "string",
//                         description: "The HTML string representation of the form image",
//                     },
//                 },
//                 required: ["htmlString"],
//             },
//         },
//     }
//   ];

// export async function generateHtml() {
//     const openai = new OpenAI();
//     const folderPath = path.join(process.cwd(), 'input-files'); // Replace with your folder path

//     try {
//         const fileNames = await listFilesInFolder(folderPath);
//         console.log('Files in folder:', fileNames);

//         if (fileNames.length !== 1) {
//             throw new Error("input-files must only have 1 image file");
//         }

//         const imagePath = path.join(folderPath, fileNames[0]);
//         const base64String = await convertImageToBase64(imagePath);
//         console.log('Converted', imagePath);

//         const completion = await openai.chat.completions.create({
//             model: 'gpt-4o',
//             messages: [
//                 { role: 'user', content: 'Can you create an html of this form? break it up into sections.' },
//                 {
//                     role: 'user',
//                     content: [
//                         {
//                             type: 'image_url',
//                             image_url: {
//                                 url: `data:image/jpeg;base64,${base64String}`
//                             }
//                         }
//                     ]
//                 }
//             ],
//             tools: availableFunctions,
//         });

//         const message = completion.choices[0].message;
        
//         if (message.tool_calls) {
//             for(const tool of message.tool_calls){
//                 if(tool.id==='insertHtml'){
//                     const args = JSON.parse(tool.function.arguments) as { htmlString: string};

//                     if(!args.htmlString){
//                         throw "HTML string is null or undefined";
//                     }
            
//                     const filePath = path.join(process.cwd(), 'temp-responses', `${generateDateSuffix()}.txt`);
//                     await writeFile(filePath, args.htmlString);
//                     return filePath;
//                 }
//             }
//         } else {
//             console.log(`Response: ${message.content}`);
//         }
        
//         throw "No html string was returned by GPT";
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }
