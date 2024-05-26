#!/usr/bin/env -S npm run tsn -T
import { generateHtml } from './html-generator'
import { Command } from 'commander';
import path from 'path';

const program = new Command();

const handleGenerateFromImage = async () => {
  const filePath = await generateHtml();
  await generateAngularApp(filePath as string);
};

const regenerateAngularApplication = async (filename: string) => {
  const filePath = path.join(__dirname, 'temp-responses', `${filename}.txt`);
  await generateAngularApp(filePath);
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
  if(!filePath){
    throw new Error("Invalid path");
  }
  
}

