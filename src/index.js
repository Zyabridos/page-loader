import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import path from 'path';
import { downloadResources, extractLinks, replaceLinks } from '../utils/linksUtils.js';
import {
  createFileName,
} from '../utils/smallUtils.js';

const log = debug('page-loader.js');

const pageLoader = (domain, filepath = process.cwd()) => {
  let html;
  log(`input data is domain: ${domain}, filepath: ${filepath}`);
  const htmlFileName = `${createFileName(domain)}.html`;
  const htmlFileFolder = path.join((filepath, htmlFileName));

  const filesDestination = path.join(filepath, '_files');

  return axios.get(domain)
    .then((response) => {
      log('preparing html for futher manipulations');
      html = response.data;
    })
    .then(() => {
      log(`creating directories for files: ${filesDestination}`);
      return fsp.mkdir(filesDestination, { recursive: true });
    })
    .then(() => {
      const $ = cheerio.load(html);
      const links = extractLinks($, domain);
      log(`downloading extracted resourses: ${links}`);
      return downloadResources(links, filesDestination);
    })
    .then(() => {
      const $ = cheerio.load(html);
      log(`writing result to ${htmlFileFolder}`);
      const newHtml = replaceLinks($, domain);
      return fsp.writeFile(htmlFileFolder, newHtml);
    })
    .then(() => path.join(filepath, htmlFileName));
};

export default pageLoader;
