import fsp from 'fs/promises';
import { join } from 'path';
import { createDirectory, createFileName } from "./url.js";

const domain = 'https://ru.hexlet.io/';

export const downloadHTML = (domain, filepath = './') => {
  const fileNameHTML = createFileName(domain, '.html');
  const domainFolder = createFileName(domain, '');

  createDirectory(domainFolder);

  const listPromise = fetch(domain)
  .then((response) => {
    return response.text();
  })
  .then((fileContent) => {
    fsp.writeFile(join(process.cwd(), domainFolder, fileNameHTML), fileContent);
    //вот здесь нужно будет создать полный путь типа '/app/page-loader/page-loader-hexlet-repl.co.html'
    console.log(`Page was successfully downloaded into ${domainFolder}`)
  });
};

// downloadHTML(domain);
