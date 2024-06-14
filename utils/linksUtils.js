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

export const extractLinks = ($, domain) => {
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);
      if (isAbsolute(href)) {
        links.push(href);
      } else if (!isAbsolute(href)) {
        links.push(`${domain}/${href}`);
      }
    });

    return links
    // вот так нормально не получится :(, но зато так мы не пропустим не абсолютные ссылки
      // .filter((link) => link !== undefined);
      .filter((link) => !link.endsWith(undefined))
      .map((link) => new URL(link).href)
      // может, таки оставим сторонние домены? Как-никак все png, jpg и css находятся на
      // https://cdn2.hexlet.io/assets/
      .filter((link) => isSameDomain(link, domain));
  });
};

export const replaceLinks = ($, domain, filepath) => {
  let renamedLinks = [];
  const entries = Object.entries(mappingTagsAndAttrbs);
  renamedLinks = extractLinks($, domain).map((current) => renamedLinks.push(changeLinksToLocal(current)));
  // mappingTagsAndAttrbs.map((current) => {
  entries.forEach((current) => {
    const { tag, attr } = current;
    $(tag).each(function replaceLink(i) {
      const newSrc = renamedLinks[i];
      return $(this).attr(attr, newSrc);
    });
    return fsp.writeFile(filepath, $.html());
  });
};
