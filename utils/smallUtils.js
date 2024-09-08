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

export const absolutizeLink = (href, domainBase) => {
  if (isAbsolute(href)) {
    return href;
  }
  const url = new URL(domainBase);
  return url.origin + href;
};

export const createHtmlFileName = (domain) => {
  const url = new URL(domain);
  const base = domain.split(`${url.protocol}//`)[1];
  return `${replaceSymbolsWithDash(base)}.html`;
};

export const createAssetName = (link, domain) => {
  let absoluteUrl = link;
  if (!isAbsolute(link)) {
    absoluteUrl = domain + link;
  }
  const { name, ext, dir } = path.parse(absoluteUrl);
  let newDir = dir.split(domain)[1];
  if (newDir === undefined) {
    newDir = '';
  }
  const fileName = `${newDir}/${name}`;
  const url = new URL(domain);
  return replaceSymbolsWithDash(url.hostname + fileName) + (ext || '.html');
};
