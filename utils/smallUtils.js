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
  const regex1 = /\/\//;
  const regex2 = /\/|\./gi;
  return string.replace(regex1, '/')
    .replace(regex2, '-');
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

export const createHtmlFileName = (domain) => {
  const url = new URL(domain);
  const base = domain.toString().split(`${url.protocol}//`)[1];
  return `${replaceSymbolsWithDash(base)}.html`;
};

export const createAssetName = (href) => {
  const url = new URL(href);
  const { name, ext, dir } = path.parse(href);
  const newDir = dir.split(url.host)[1];
  const fileName = `${newDir}/${name}`;
  return replaceSymbolsWithDash(url.hostname + fileName) + (ext || '.html');
};
