import * as cheerio from 'cheerio';
import axios from 'axios';
import { isAbsolute, mappingTagsAndAttrbs } from './smallUtils.js';
import { renameLinks } from './renameLinks.js';

// const url = 'https://www.w3schools.com';
const url = 'https://ru.hexlet.io/courses';

export async function extractLinks(domain) {
  const regex = /\.js|.css|.png|.jpg/g;
  const response = await axios.get(domain);
  const html = response.data;
  let links = [];
  const $ = cheerio.load(html);
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function (extractEachLink) {
      let href = $(this).attr(attr);
      if (href && isAbsolute(href) && regex.test(href)) {
        links.push(href);
      } else if (href && !isAbsolute(href) && regex.test(href)) {
        href = `${domain}${href}`;
        links.push(href);
      }
    });
  });
  return links;
}

// extractLinks(url)
// .then((links) => links.map((link) => renameLinks(link)))
// .then((modifiedLink) => console.log(modifiedLink));
