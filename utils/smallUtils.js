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

export const makeAbsolute = (domain, link) => domain + link;

export const removeDoubleDash = (link) => {
  const url = new URL(link);
  const regex = /\/\//;
  return `https://${url.hostname}${url.pathname.replace(regex, '/')}`;
};

export const changeLinksToLocal = (url, domain) => {
  if (isAbsolute(url)) {
    return path.join(createFolderName(url), '_files', createFileName(url));
  }

  const absoluteURL = (makeAbsolute(domain, url));
  return path.join(createFolderName(absoluteURL), '_files', createFileName(absoluteURL));
};
