import axios from 'axios';
import Listr from 'listr';
import path from 'node:path';
import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import {
  isAbsolute,
  createFileName,
  mappingTagsAndAttrbs,
  isSameDomain,
  makeAbsolute,
  createFolderName,
} from './smallUtils.js';

export const downloadResources = (links, domain, filepath) => {
  const promises = links.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const fileName = createFileName(link, domain);
        // console.log(fileName);
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
      // console.log(`extracted href: ${href}`);
      return isAbsolute(href) ? links.push(href) : links.push(makeAbsolute(domain, href));
    });
  });
  entries.forEach(([tag, attr]) => {
    $(tag).each(function replaceLink() {
      const href = $(this).attr(attr);
      // console.log(`href: ${href}`);
      if (href && isSameDomain(href, domain)) {
        // console.log(`domain is: ${domain}`);
        // const folderName = createFolderName(domain);
        // console.log(`created folder name is: ${folderName}`);
        // console.log(`filesFolder is: ${createFolderName(domain)}_files`);
        const newSrc = path.join(`${createFolderName(domain)}_files`, createFileName(href, domain));
        // console.log(`newSrc: ${newSrc}`);
        $(this).attr(attr, newSrc);
      }
    });
  });

  return [$.html(), links
    .filter((link) => !link.endsWith(undefined))
    .map((link) => new URL(link).href)
    .filter((link) => isSameDomain(link, domain)),
    // .filter((link, index) => links.indexOf(link) !== index),
  ];
};
