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

export const createFolderName = (domain) => {
  const url = new URL(domain);
  return url.hostname.split('.').join('-');
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
  createFolderName(absoluteURL) + '/_files/' + createFileName(absoluteURL);

export const writeFile = (fileName, fileContent, filepath = './') =>
  fsp.writeFile(join(process.cwd(), filepath, fileName), fileContent);

export const makeAbsolute = (domain, link) => domain + link;

// console.log(changeLinksToLocal('https://www.w3schools.com/images/colorpicker2000.png'))

// console.log(createFolderName('https://www.w3schools.com/images/colorpicker2000.png'))

// console.log(createFileName('https://www.w3schools.com/images/colorpicker2000.png'))