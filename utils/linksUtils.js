import axios, { all } from 'axios';
import Listr from 'listr';
import path from 'path';
import fsp from 'fs/promises';
import { URL } from 'url';
import {
  isAbsolute,
  changeLinksToLocal,
  createFileName,
  mappingTagsAndAttrbs,
  isSameDomain,
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

export const extractLinks = ($, domain) => {
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);

      if (href.startsWith('https:')) {
        return;
      }

      const url = new URL(href, domain);
      const domainURL = new URL(domain);

      if (url.origin === domainURL.origin) {
        links.push(href);
      }
    });
  });

  return links.filter((link) => link !== undefined);
};

export const replaceLinks = ($, domain, filepath) => {
  let renamedLinks = [];
  renamedLinks = extractLinks($, domain).map((current) => renamedLinks.push(changeLinksToLocal(current)));
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function replaceLink(i) {
      const newSrc = renamedLinks[i];
      return $(this).attr(attr, newSrc);
    });
    return fsp.writeFile(filepath, $.html());
  });
};
