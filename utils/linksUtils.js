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
  isAbsolute,
  makeAbsolute,
} from './smallUtils.js';

export const downloadResources = (links, domain, filepath) => {
  // console.log(links);
  // links.filter((link) => isSameDomain(link, domain));
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

export const extractResourses = (html) => {
  const $ = cheerio.load(html);
  const result = [];
  const entries = Object.entries(mappingTagsAndAttrbs);

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);
      if (!href) { return; }

      const obj = {
        // element,
        tag,
        attr,
        href,
      };
      return result.push(obj);
    });
  });
  return result;
};

export const replaceLinks = (html, domain, linksToReplace) => {
  const $ = cheerio.load(html);
  const newSrc = [];
  linksToReplace.map((link) => newSrc.push((`${createFolderName(domain)}_files/${createFileName(link.href, domain)}`)));

  linksToReplace.forEach((link) => {
    $(link.tag).each((index, element) => {
      $(element).attr((link.attr, newSrc[index]));
    });
  });
  return $.html();
};

export const processLinks = (links, domain) => {
  const finalLinks = [];
  links.filter((link) => isSameDomain(link.href, domain))
    .map((link) => (isAbsolute(link.href) ? finalLinks.push(link.href) : finalLinks.push(makeAbsolute(domain, link.href))));
  return finalLinks;
};

const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Курсы по программированию Хекслет</title>
    <link rel="stylesheet" media="all" href="https://cdn2.hexlet.io/assets/menu.css">
    <link rel="stylesheet" media="all" href="/assets/application.css" />
    <link href="/courses" rel="canonical">
  </head>
  <body>
    <img src="/assets/professions/nodejs.png" alt="Иконка профессии Node.js-программист" />
    <h3 class="title">
      Hello, hell!
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="/packs/js/runtime.js"></script>
  </body>
</html>`;

// console.log(extractAndReplaceLinks(html, 'https://ru.hexlet.io/courses'));

// const links = extractResourses(html);
// const filteredLinks = processLinks(links, 'https://ru.hexlet.io/courses');
// console.log(filteredLinks);
