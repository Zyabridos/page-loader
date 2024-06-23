import axios from 'axios';
import Listr from 'listr';
import path from 'path';
import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import {
  isAbsolute,
  changeLinksToLocal,
  createFileName,
  mappingTagsAndAttrbs,
  isSameDomain,
  makeAbsolute,
} from './smallUtils.js';

export const downloadResources = (links, filepath) => {
  const promises = links.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const fileName = createFileName(link);
        const filesDestination = path.join(filepath, fileName);
        return fsp.writeFile(filesDestination, response.data);
      }),
  }));

  return new Listr(promises, { recursive: true, exitOnError: false }).run().catch(() => {});
};

export const extractLinks = (html, domain) => {
  const $ = cheerio.load(html);
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);
      return isAbsolute(href) ? links.push(href) : links.push(makeAbsolute(domain, href));
    });
  });

  return links
    .filter((link) => !link.endsWith(undefined))
    .map((link) => new URL(link).href)
    .filter((link) => isSameDomain(link, domain));
};

export const replaceLinks = (html, domain) => {
// export const replaceLinks = (html, domain, fileDestination) => {
  const $ = cheerio.load(html);
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each(function replaceLink() {
      const current = $(this).attr(attr);
      if (current && isSameDomain(current, domain)) {
        const newSrc = changeLinksToLocal(current, domain);
        $(this).attr(attr, newSrc);
      }
    });
  });
  return $.html();
  // return fsp.writeFile(fileDestination, $.html());
};
