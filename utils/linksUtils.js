import axios from 'axios';
import Listr from 'listr';
import path from 'node:path';
import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import uniq from 'lodash/uniq.js';
import {
  createFileName,
  mappingTagsAndAttrbs,
  isSameDomain,
  createFolderName,
} from './smallUtils.js';

export const downloadResources = (links, domain, filepath) => {
  const promises = links.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const fileName = createFileName(link, domain);
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
      return links.push(href);
    });
  });
  return uniq(links)
    .filter((link) => isSameDomain(link, domain))
    .filter((link) => link !== undefined);
};

export const replaceLinks = (html, domain, linksToReplace) => {
  const $ = cheerio.load(html);
  const withThosLinksReplace = [];

  linksToReplace.map((link) => withThosLinksReplace.push(`${createFolderName(domain)}_files/${createFileName(link, domain)}`));
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each(function replaceLink(i) {
      const newSrc = withThosLinksReplace[i];
      $(this).attr(attr, newSrc);
    });
  });

  return $.html();
};
