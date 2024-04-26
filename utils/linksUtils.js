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

export function downloadResource (fullLink, dirname) {
  const fileName = createFileName(fullLink);
  axios.get(fullLink, { responseType: 'arraybuffer' })
  .then((response) => {
    writeFile(fileName, response.data, dirname);
  });
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
  // console.log($.html())
  return $.html();
}

export const extractLinks = ($, domain) => {
  const regex = /\.js|.css|.png|.jpg/g;
  let links = [];
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function () {
      let href = $(this).attr(attr);
// if(href.endsWith('png')) {
        if (href && isAbsolute(href) && regex.test(href)) {
          links.push(href);
        } else if (href && !isAbsolute(href) && regex.test(href)) {
          href = `${domain}/${href}`;
          links.push(href);
        }
// }
      }
    );
  });
  return links;
};

downloadResource('https://cdn2.hexlet.io/assets/professions/program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png', './');