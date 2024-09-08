import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import path from 'path';
import {
  extractAndReplaceLinks, downloadLocalResources,
} from '../utils/linksUtils.js';
import {
  createFolderName,
  createHtmlFileName,
} from '../utils/smallUtils.js';

const log = debug('page-loader.js');

const pageLoader = (domain, filepath = process.cwd()) => {
  let html;
  log(`input data is domain: ${domain}, filepath: ${filepath}`);
  const htmlFileName = createHtmlFileName(domain);
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
      const { links, newHtml } = extractAndReplaceLinks(html, domain);
      log(`downloading extracted resourses: ${links}`);
      return downloadLocalResources(links, domain, filesDestination)
        .then(() => {
          log(`writing result to ${htmlFileFolder}`);
          return fsp.writeFile(path.join(filepath, htmlFileName), newHtml);
        });
    })
    .then(() => path.join(filepath))
    .catch((e) => {
      console.error(`An error has occurred: ${e.message}`);
      throw new Error(e.message);
    });
};

export default pageLoader;
