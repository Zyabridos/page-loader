import path from 'path';
import { URL } from 'url';

export const mappingTagsAndAttrbs = {
  img: 'src',
  link: 'href',
  script: 'src',
};

export const isSameDomain = (link, url) => {
  const originalHost = new URL(url).origin;
  return new URL(link, originalHost).origin === originalHost;
};

export const replaceSymbolsWithDash = (string) => {
  const regex = /\/|\./gi;
  return string.replace(regex, '-');
};

export const removeDoubleDashes = (string) => {
  const regex = /\/\//;
  return string.replace(regex, '/');
};

export const createFolderName = (domain) => {
  const url = new URL(domain);
  const folderNameTemp = url.hostname + url.pathname;
  return folderNameTemp.endsWith('/') ? replaceSymbolsWithDash(folderNameTemp).slice(0, -1) : replaceSymbolsWithDash(folderNameTemp);
};

export const isAbsolute = (url) => {
  const regex = /^.+?[a-z]{1,}:\/\//;
  return regex.test(url);
};

export const makeAbsolute = (domain, link) => domain + link;

export const createFileName = (link, domain) => {
  let absoluteUrl = link;
  if (!isAbsolute(absoluteUrl)) {
    absoluteUrl = makeAbsolute(domain, link);
  }
  const url = new URL(absoluteUrl);
  const { dir, name, ext } = path.parse(absoluteUrl);
  // remove https:// or http://
  const rightDir = dir.split(`${url.protocol}//`)[1];
  const fileNameBase = removeDoubleDashes(`${rightDir}/${name}`);
  return replaceSymbolsWithDash(fileNameBase) + (ext || '.html');
};

export const removeDoubleHyphens = (string) => {
  const regex = /--/;
  return string.replace(regex, '-');
};

const domain = 'https://ru.hexlet.io/courses';
const domain2 = 'https://ru.hexlet.io/courses/';
const hrefPNG = '/assets/professions/nodejs.png';

// console.log(createFileName('https://ru-hexlet-io-courses/courses', 'https://ru.hexlet.io/courses'));
// console.log(makeAbsolute('https://ru.hexlet.io/courses', '/manifest.json'));
// console.log(createFolderName(domain));
// console.log(path.join(`${createFolderName(domain)}_files`, createFileName(hrefPNG, domain)));
const filepath = './';
console.log(path.join(filepath, `${createFolderName(domain)}_files`));
console.log(path.join(filepath, `${createFolderName(domain2)}_files`));
