#!/usr/bin/env node
import debug from 'debug';
import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility')
  .version('0.1.0')
  .option('-o, --output [dir]', 'output dir (default: "/home/user/current-dir")')
  .option('-d --debug', 'run this option for debugging')
  .argument('<url>')
  .action((url, option) => {
    if (option.debug) {
      debug.enable('page-loader*,axios');
    }
    pageLoader(url, option.output)
    .then(() => console.log(`The page ${url} was successfully dowloaded into !!! - need to fix that`))
    .catch((error) => {
      console.error(error.message)
      process.exit(1);
    })
  });

program.parse();

// node bin/page-loader.js https://ru.hexlet.io/courses
