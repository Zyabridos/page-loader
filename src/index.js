import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import path from 'path';
import {
  downloadResources, extractResourses, processLinks, replaceLinks,
} from '../utils/linksUtils.js';
import {
  createFileName,
  createFolderName,
} from '../utils/smallUtils.js';

const log = debug('page-loader.js');

const pageLoader = (domain, filepath = process.cwd()) => {
  let html;
  let newHtml;
  log(`input data is domain: ${domain}, filepath: ${filepath}`);
  const htmlFileName = `${createFileName(domain)}`;
  const htmlFileFolder = path.join((filepath, htmlFileName));

  const filesDestination = path.join(filepath, `${createFolderName(domain)}_files`);

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
      const resourses = extractResourses(html);
      const links = resourses.map((link) => processLinks(link.href, domain));
      newHtml = replaceLinks(html, domain, links);
      log(`downloading extracted resourses: ${links}`);

      return downloadResources(links, domain, filesDestination);
    })
    .then(() => {
      log(`writing result to ${htmlFileFolder}`);
      return fsp.writeFile(path.join(filepath, htmlFileName), newHtml);
    })
    .then(() => path.join(filepath));
};

export default pageLoader;
