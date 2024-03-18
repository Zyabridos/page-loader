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
};

export const createFileName = (fullLink) => {
  const url = new URL(fullLink);
  const folderName = url.hostname.split('.').join('-');
  let pathname = url.pathname;
  if (pathname.startsWith('//')) {
    pathname = pathname.slice(1, )
  }
  const fileName = pathname.split('/').join('-');
  return `${folderName}${fileName}`
};

export const isAbsolute = (url) => url.startsWith('https://') ?? true

export const changeLinksToLocal = (absoluteURL) => createFolderName(absoluteURL) + '_files/' + createFileName(absoluteURL);
