import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import path from 'path';
import {
  downloadResources, extractAndReplaceLinks,
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
  // console.log(domain);
  console.log(`The folder name is: ${filesDestination}`);

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
      const [tempHtml, links] = extractAndReplaceLinks(html, domain);
      log(`downloading extracted resourses: ${links}`);
      newHtml = tempHtml;
      return downloadResources(links, domain, filesDestination);
    })
    .then(() => {
      log(`writing result to ${htmlFileFolder}`);
      return fsp.writeFile(path.join(filepath, htmlFileName), newHtml);
    })
    .then(() => path.join(filepath));
};

export default pageLoader;
