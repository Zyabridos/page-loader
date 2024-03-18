import fsp from 'fs/promises';
import { createFileName, createFolderName } from './smallUtils.js';
import axios from 'axios';
import { join } from "path";
import { URL } from 'url';
import debug from 'debug';

export async function downloadFileFromFullLink(domain, filepath = createFolderName(domain)) {
  const fileNamePNG = createFileName(domain);
  
  const url = new URL(domain);
  const hostname = url.hostname.split(`${url.pathname}`);

  const domainFolderName = hostname[0].split('.').join('-');

  const projectFolder = join(domainFolderName, '_files');
  const dirCreation = fsp.mkdir(projectFolder, { recursive: true });

  const response = await axios.get(domain, { responseType: 'arraybuffer' });
  fsp.writeFile(join(process.cwd(), `./${domainFolderName}/_files`, fileNamePNG), response.data);

  // если я пишу вот так, то картинка скачивается, но не открывается = 'It may be damaged or use a file format that Preview doesn’t recognise.'
  // Как исправить, ибо надо ведь весь проект писать на промисах?


  // axios.get(domain)
  // .then((response) => response.data)
  // .then((fullLink) => {
  //   fsp.writeFile(join(process.cwd(), `./${domainFolderName}/_files`, fileNamePNG), fullLink);
  // });


};

const log = debug('downloadFileFromFullLink')
