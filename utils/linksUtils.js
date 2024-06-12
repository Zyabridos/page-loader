import axios from 'axios';
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
  const url = new URL(domain);
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);
  entries.map(([tag, attribute]) => $(tag).each(function extractLink() {
    let href = new URL($(this).attr(attribute));
    if (isAbsolute(href)) {
      links.push(href);
    } else if (!isAbsolute(href)) {
      href = `${domain}/${href}`;
      links.push(href);
    }
  }));
  return links.filter((link) => isSameDomain(link, url));
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
