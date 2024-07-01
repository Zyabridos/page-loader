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
      log(`checking the access to the ${filepath} and creating directories for files: ${filesDestination}`);
      return fsp.access(filepath)
        .then(() => fsp.mkdir(filesDestination, { recursive: true }));
    })
    .then(() => {
      const links = extractLinks(html, domain);
      log(`downloading extracted resourses: ${links}`);
      return downloadResources(links, filesDestination);
    })
    .then(() => {
      log(`writing result to ${htmlFileFolder}`);
      const newHtml = replaceLinks(html, domain);
      return fsp.writeFile(path.join(filepath, htmlFileName), newHtml);
    })
    .then(() => path.join(filepath));
};

export default pageLoader;
