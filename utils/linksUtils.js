import axios from 'axios';
import Listr from 'listr';
import path from 'node:path';
import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import uniq from 'lodash/uniq.js';
import {
  createAssetName,
  mappingTagsAndAttrbs,
  isSameDomain,
  createFolderName,
} from './smallUtils.js';

export const downloadLocalResources = (links, domain, filepath) => {
  const promises = links.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const fileName = createAssetName(link, domain);
        const filesDestination = path.join(filepath, fileName);
        return fsp.writeFile(filesDestination, response.data);
      })
      .catch((error) => {
        console.error(`An error has occured: ${createAssetName(link, domain)} was not saved, ${error}`);
        throw new Error(error.message);
      }),
  }));

  return new Listr(promises, { recursive: true, exitOnError: false }).run().catch(() => {});
};

export const extractAndReplaceLinks = (html, domain) => {
  const $ = cheerio.load(html);
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);
  const fileNames = [];

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);
      if (isSameDomain(href, domain) && href !== undefined) {
        const url = new URL(href, domain);
        links.push(url.href);
        fileNames.push(createAssetName(url.href));
        $(element).attr(attr, (`${createFolderName(domain)}_files/${createAssetName(url.href)}`));
      }
    });
  });
  return { links: uniq(links), fileNames: uniq(fileNames), newHtml: $.html() };
};
