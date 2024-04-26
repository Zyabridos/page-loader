import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import {
  writeFile,
  createFileName,
  createFolderName,
  changeLinksToLocal,
} from '../utils/smallUtils.js';
import path from 'path';
import { downloadResource, extractLinks, replaceLinks } from '../utils/linksUtils.js';

const log = debug('page-loader.js');

// const url = 'https://www.w3schools.com';
const url = 'https://ru.hexlet.io/courses';

async function pageLoader (domain, filepath = './')  {
  const htmlFileName = createFileName(domain) + '.html';
  const folderName = createFolderName(domain);
  const filesDestination = path.join('./', folderName, '_files');
  fsp.mkdir(path.join(filepath, folderName, '_files'), { recursive: true});

  const response = await axios.get(domain);
  const html = response.data;
  const $ = cheerio.load(html);
  const links = extractLinks($, domain);
  const replacementLinks = [];
  links.forEach((current) => replacementLinks.push(changeLinksToLocal(current)));
  const newHTML = replaceLinks($, replacementLinks, domain);

  links.map((current) => {
    log(`Downloading a resource from ${current} into ${filesDestination}`);
        downloadResource(current, filesDestination);
  })

  return axios
    .get(domain)
    .then((response) => {
      log(`Downloading an html named ${htmlFileName} into folder ${folderName}`);
      writeFile(htmlFileName, response.data, folderName);
      writeFile(htmlFileName, newHTML, folderName);
    })
};


pageLoader(url)

export default pageLoader;
