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
  const htmlFileDest = path.join(filepath, folderName, htmlFileName);

  const filesDestination = path.join(folderName, '_files');

  return axios.get(domain)
    .then((response) => {
      html = response.data;
    })
    .then(() => {
      log(`creating directories for files: ${filesDestination}`);
      fsp.mkdir(filesDestination, { recursive: true });
    })
    .then(() => {
      const $ = cheerio.load(html);
      const links = extractLinks($, domain);
      return downloadResources(links, filesDestination);
    })
    .then(() => {
      const $ = cheerio.load(html);
      const newHtml = replaceLinks($, domain);
      console.log(htmlFileDest);
      // return fsp.writeFile(path.join((filepath, folderName, htmlFileName)), newHtml);
      return fsp.writeFile(path.join((filepath, htmlFileName)), newHtml);
      // return fsp.writeFile(htmlFileDest, newHtml);
    })
    .then(() => path.join(htmlFileDest, htmlFileName));
};

export default pageLoader;
