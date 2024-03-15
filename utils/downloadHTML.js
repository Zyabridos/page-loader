import fsp from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
import { createDirectories, createFileName, createFolderName } from "./smallUtils.js";

const url = 'https://www.w3schools.com';

export const downloadHTML = (domain, filepath = './') => {
  const fileNameHTML = createFileName(domain) + '.html';
  const domainFolder = createFolderName(domain);

  createDirectories(domainFolder);

  axios.get(domain)
  .then((response) => response.data)
  .then((fileContent) => {
    fsp.writeFile(join(process.cwd(), domainFolder, fileNameHTML), fileContent);
    //вот здесь нужно будет создать полный путь типа '/app/page-loader/page-loader-hexlet-repl.co.html'
    console.log(`Page was successfully downloaded into ${domainFolder}`)
  });
};

downloadHTML(url);
