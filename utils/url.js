import fsp from 'fs/promises';
import { join } from "path";
import { URL } from 'url';
import axios from 'axios';

export async function createDirectories(domainFolder) {
  // const projectFolder = join(dirname, 'test', 'project');
  const projectFolder = join(domainFolder, '_files');
  const dirCreation = fsp.mkdir(projectFolder, { recursive: true });

  return dirCreation;
}


export const createFolderName = (domain) => {
  const url = new URL(domain);
  return url.hostname.split('.').join('-');
}

export const createFileName = (domain, fileFormat = '') => {
  const url = new URL(domain);
  const hostname = url.hostname.split('.').join('-');
  const pathname = url.pathname.split('/').join('-').split(0, -1);
  return `${hostname}${pathname}${fileFormat}`
};

// downloadImage(imageURL, './', 'cd.png');
// createDirectories(createFileName('https://ru.hexlet.io/courses'))

// console.log(createFileName('https://ru.hexlet.io/courses'))
// console.log(createFolderName('https://bridgeport.edu/files/images/template/web-logo.png'))