import fsp from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
import { createDirectories, createFileName, createFolderName } from "./smallUtils.js";
import debug from 'debug';

// const url = 'https://www.w3schools.com';

const url = 'https://ru.hexlet.io/courses';

const log = debug('downloadHTML');

export const downloadHTML = (domain, filepath = createFolderName(domain)) => {
  const fileNameHTML = createFileName(domain) + '.html';

  createDirectories(filepath);

  axios.get(domain)
  .then((response) => response.data)
  .then((fileContent) => {
    fsp.writeFile(join(process.cwd(), filepath, fileNameHTML), fileContent);
    //вот здесь нужно будет создать полный путь типа '/app/page-loader/page-loader-hexlet-repl.co.html'
    console.log(`Page was successfully downloaded into ${filepath}`);
    log('cmcmcmc')
  });
};

downloadHTML(url);
