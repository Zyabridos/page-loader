import axios from 'axios';
import Listr from 'listr';
import path from 'path';
import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import {
  isAbsolute,
  changeLinkToLocal,
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

export const extractAndReplaceLinks = (html, domain) => {
  const $ = cheerio.load(html);
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);
      return isAbsolute(href) ? links.push(href) : links.push(makeAbsolute(domain, href));
    });
  });
  entries.forEach(([tag, attr]) => {
    $(tag).each(function replaceLink() {
      const href = $(this).attr(attr);
      if (href && isSameDomain(href, domain)) {
        const newSrc = changeLinkToLocal(href, domain);
        $(this).attr(attr, newSrc);
      }
    });
  });

  return [$.html(), links
    .filter((link) => !link.endsWith(undefined))
    .map((link) => new URL(link).href)
    .filter((link) => isSameDomain(link, domain))
    .filter((link, index) => links.indexOf(link) !== index),
  ];
};
