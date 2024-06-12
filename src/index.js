import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import path from 'path';
import { downloadResources, extractLinks, replaceLinks } from '../utils/linksUtils.js';
import {
  createFileName,
  createFolderName,
} from '../utils/smallUtils.js';

const log = debug('page-loader.js');

const pageLoader = (domain, filepath = process.cwd()) => {
  let html;
  log(`input data is domain: ${domain}, filepath: ${filepath}`);
  const htmlFileName = `${createFileName(domain)}.html`;
  const folderName = (path.join(filepath, createFolderName(domain)));

  const filesDestination = path.join(folderName, '_files');

  return axios.get(domain)
    .then((response) => {
      html = response.data;
    })
    .then(() => fsp.mkdir(filesDestination, { recursive: true }))
    .then(() => {
      const $ = cheerio.load(html);
      const links = extractLinks($, domain);
      return Promise.all([
        downloadResources(links, filesDestination)
          .then(() => replaceLinks($, domain, path.join(folderName, htmlFileName))),
      ]);
    })
    .then(() => path.join(filepath, htmlFileName));
};

export default pageLoader;
