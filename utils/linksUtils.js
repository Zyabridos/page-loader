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
      return isAbsolute(href) ? links.push(href) : links.push(makeAbsolute(domain, href));
    });
  });

  return links
  // вот так нормально не получится :(, но зато так мы не пропустим не абсолютные ссылки
  // .filter((link) => link !== undefined);
    .filter((link) => !link.endsWith(undefined))
    .map((link) => new URL(link).href)
  // может, таки оставим сторонние домены? Как-никак все png, jpg и css находятся на
  // https://cdn2.hexlet.io/assets/
  // там много другой ерунды, но можно фильтровать по своему желанию regex = /\.js|.css|.png|.jpg/g;
  // или еще какие советы есть?
    .filter((link) => isSameDomain(link, domain));
  // console.log(result);
  // return result;
};

export const replaceLinks = ($, domain) => {
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
};
