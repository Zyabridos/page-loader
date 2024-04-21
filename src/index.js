import axios from 'axios';
import debug from 'debug';
import {
  writeFile,
  createDirectories,
  createFileName,
  createFolderName,
} from '../utils/smallUtils.js';
import { extractLinks } from '../utils/extractLinks.js';
import path from 'path';
import { downloadFileFromFullLink } from '../utils/downloadSingleLink.js';
import { renameLinks } from '../utils/renameLinks.js';

const log = debug('page-loader.js');

// const url = 'https://www.w3schools.com';
const url = 'https://ru.hexlet.io/courses';

const pageLoader = (domain, filepath = './') => {
  const fileName = createFileName(domain) + '.html';
  const folderName = createFolderName(domain);
  const links = extractLinks(domain);


  log(`Creating directory. Directory name: ${folderName}`);
  createDirectories(folderName);

  return Promise.all(
    [axios
    .get(domain)
    .then((response) => response.data)
    .then((fileContent) => {
      log(`Downloading an html named ${fileName} into folder ${folderName}`);
      writeFile(fileName, fileContent, folderName);
    })])
    .then(
  links
    // как предпочтительнее писать - так писать, или через отдельную функцию downloadAllLinks
    .then((links) => {
      links.map((currentLink) => {
        const filesDestination = path.join('./', folderName, '_files');
        log(`Downloading the file ${currentLink} into folder ${filesDestination}`);
        downloadFileFromFullLink(currentLink, filesDestination);
      });
    })
    )
    // возвращает href="[object Promise]", хотя ссылки меняются коректно в функции. Как переделать, чтобы нормально было?
    .then(renameLinks(domain))
};

export default pageLoader;
