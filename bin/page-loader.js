#!/usr/bin/env node
import pageLoader from '../src/index.js';
import { Command } from 'commander';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .version('0.1.0')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')
  .argument('<filepath>', 'path to directory, where the file will be saved')
  .action((url, filepath) => {
    pageLoader(url, filepath)
  });

  // .action((filepath1, filepath2, formatName) => {
  //   const diff = genDiff(filepath1, filepath2, formatName.format);
  //   console.log(diff);
  // });

program.parse();
