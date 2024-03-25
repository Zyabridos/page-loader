#!/usr/bin/env node
import debug from 'debug';
import pageLoader from '../src/index.js';
import { Command } from 'commander';

const program = new Command();
const log = debug('page-loader.js');

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
        console.log(`The page ${url} was successfully dowloaded into`);
  });

program.parse();
