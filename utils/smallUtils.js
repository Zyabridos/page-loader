import fsp from 'fs/promises';
import { join } from 'path';
import { URL } from 'url';

const url = 'https://ru.hexlet.io/courses';
const url2 = 'https://www.w3schools.com';

export const mappingTagsAndAttrbs = [
  { tag: 'img', attr: 'src' },
  { tag: 'link', attr: 'href' },
  { tag: 'a', attr: 'href' },
];

export const isSameDomain = (link1, link2) => {
  const url1 = new URL(link1);
  const url2 = new URL(link2);
  return url1.hostname === url2.hostname;
};

export async function createDirectories(domainFolder) {
  const projectFolder = join(domainFolder, '_files');
  const dirCreation = fsp.mkdir(projectFolder, { recursive: true });

  return dirCreation;
}

export const createFolderName = (domain) => {
  const url = new URL(domain);
  return url.hostname.split('.').join('-') + url.pathname.split('/').join('-');
};

export const createFileName = (link) => {
  const url = new URL(link);
  if (url.pathname.startsWith('//') || url.pathname.startsWith('/')) {
    url.pathname = url.pathname.slice(1);
  }
  return url.hostname.split('.').join('-') + url.pathname.split('/').join('-');
};

export const isAbsolute = (url) => {
  const regex = /^.+?[a-z]{1,}:\/\//;
  return regex.test(url);
};

export const changeLinksToLocal = (absoluteURL) =>
  createFileName(absoluteURL) + '/_files/' + createFolderName(absoluteURL);

export const writeFile = (fileName, fileContent, filepath = './') =>
  fsp.writeFile(join(process.cwd(), filepath, fileName), fileContent);

export const makeAbsolute = (domain, link) => domain + link;
