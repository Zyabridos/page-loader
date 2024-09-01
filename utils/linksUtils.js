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
  absolutizeLinks,
} from './smallUtils.js';

export const downloadLocalResources = (links, domain, filepath) => {
  const absLinksToDownload = absolutizeLinks(links, domain).filter((link) => isSameDomain(link, domain));
  const promises = absLinksToDownload.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const fileName = createAssetName(link, domain);
        const filesDestination = path.join(filepath, fileName);
        return fsp.writeFile(filesDestination, response.data);
      }),
    // .catch((error) => {
    //   console.error(`An error has occured: ${createAssetName(link, domain)} was not saved, ${error}`);
    //   throw new Error(error.message);
    // }),
  }));

  return new Listr(promises, { recursive: true, exitOnError: false }).run().catch(() => {});
};

export const extractAndReplaceLinks = (html, domain) => {
  const $ = cheerio.load(html);
  const extractedLinks = [];
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each((index, element) => {
      const href = $(element).attr(attr);
      extractedLinks.push(href);
      const newSrc = extractedLinks
        .filter((currentHref) => isSameDomain(currentHref, domain))
        .map((currentHref) => (`${createFolderName(domain)}_files/${createAssetName(currentHref, domain)}`));
      if (isSameDomain(href, domain) && href !== undefined) {
        $(element).attr(attr, newSrc[index]);
      }
    });
  });
  return { extractedLinks: uniq(extractedLinks).filter((link) => link !== undefined), changedHtml: $.html() };
};
