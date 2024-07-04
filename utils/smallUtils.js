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

export const createFolderName = (domain) => {
  const url = new URL(domain);
  const regex = /[^A-Z0-9]+/gi;
  return url.hostname.replace(regex, '-');
};

export const createFileName = (domain) => {
  const url = new URL(domain);
  const regex = /[^A-Z0-9]+/gi;
  return url.hostname.replace(regex, '-') + url.pathname.replace(regex, '-');
};

export const isAbsolute = (url) => {
  const regex = /^.+?[a-z]{1,}:\/\//;
  return regex.test(url);
};

export const makeAbsolute = (domain, link) => domain + link;

export const removeDoubleDashes = (string) => {
  const regex = /\/\//;
  return string.replace(regex, '/');
};

export const removeDoubleHyphens = (string) => {
  const regex = /--/;
  return string.replace(regex, '-');
};

const replaceSymbolsWithDash = (string) => {
  const regex = /\/|\./gi;
  return string.replace(regex, '-');
};

export const changeLinkToLocal = (url, domain) => {
  let absoluteUrl = url;
  if (!isAbsolute(url)) {
    absoluteUrl = makeAbsolute(domain, url);
  }
  const { name, ext, dir } = path.parse(absoluteUrl.slice(domain.length));
  const fileName = removeDoubleHyphens(replaceSymbolsWithDash(`${dir}-${name}`) + (ext || '.html'));

  const hostnameURL = new URL(domain);

  return removeDoubleHyphens(path.join(`${createFileName(domain)}_files`, `${replaceSymbolsWithDash(hostnameURL.hostname)}-${fileName}`));
};
