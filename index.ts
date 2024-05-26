#!/usr/bin/env -S npm run tsn -T
import { generateHtml } from './src/html-generator'
import { Command } from 'commander';
import path from 'path';
import { readHtmlFile } from './src/directoryHelper';
import { writeFile } from 'fs/promises';

const program = new Command();

const handleGenerateFromImage = async () => {
  const filePath = await generateHtml();
  const fileName = path.basename(filePath as string);
  await generateAngularApp(fileName);
};

const regenerateAngularApplication = async (filename: string) => {
  await generateAngularApp(filename);
};

program
    .name('image-to-form')
    .description('A simple CLI application to generate an angular form')
    .version('1.0.0');

program
    .command('generate')
    .description('Generate angular application')
    .action(handleGenerateFromImage);

program
    .command('regenerate <filename>')
    .description('Regenerate angular app from already generated html')
    .action(regenerateAngularApplication);

program.parse(process.argv);

async function generateAngularApp(filePath: string) {
  if (!filePath) {
    throw new Error("Invalid path");
  }

  //angular-app/src/app/app.component.html
  const appPath = path.join(process.cwd(), 'angular-app/src/app/app.component.html');
  try {
    const content = await readHtmlFile(filePath);
    await writeFile(appPath, content, 'utf8');
    console.log(`File has been written successfully to ${appPath}`);
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
}

