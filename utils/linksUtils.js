import fsp from 'fs/promises';
import axios from 'axios';
import { join } from 'path';
import * as cheerio from 'cheerio';
import path from 'path';
import {
  isAbsolute,
  changeLinksToLocal,
  createFileName,
  writeFile,
  mappingTagsAndAttrbs,
} from './smallUtils.js';

const url = 'https://www.w3schools.com';
// const url = 'https://ru.hexlet.io/courses';

export const downloadResource = (fullLink, dirname) => {
  const fileName = createFileName(fullLink);
  writeFile(fileName, fullLink, dirname);
}

export const replaceLinks = ($, replacementLinks, domain) => {
  const links = extractLinks($, domain);
  const renamedLinks = []
  links.forEach((current) => renamedLinks.push(changeLinksToLocal(current)));
mappingTagsAndAttrbs.map((current) => {
  const { tag, attr } = current;
  $(tag).each(function (i) {
    const newSrc = replacementLinks[i];
    $(this).attr(attr, newSrc);
  });
})
  return $.html();
}

export const extractLinks = ($, domain) => {
  const regex = /\.js|.css|.png|.jpg/g;
  let links = [];
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function () {
      let href = $(this).attr(attr);
        if (href && isAbsolute(href) && regex.test(href)) {
          links.push(href);
        } else if (href && !isAbsolute(href) && regex.test(href)) {
          href = `${domain}${href}`;
          links.push(href);
        }
      }
    );
  });
  return links;
};
