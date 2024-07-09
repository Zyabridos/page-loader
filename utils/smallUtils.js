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
  const rightDir = dir.split(`${url.protocol}//`)[1];
  const fileNameBase = removeDoubleDashes(`${rightDir}/${name}`);
  return replaceSymbolsWithDash(fileNameBase) + (ext || '.html');
};
