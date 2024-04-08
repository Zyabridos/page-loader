import * as cheerio from 'cheerio';
import axios from 'axios';
import { extractLinks } from './extractLinks.js';
import { changeLinksToLocal, createFileName, writeFile, mappingTagsAndAttrbs } from './smallUtils.js';

const url = 'https://www.w3schools.com';

export async function renameLinks (domain, filepath = './') {
  const fileName = createFileName(domain);
  const response = await axios.get(domain);
  const html = response.data;
  const $ = cheerio.load(html);
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function () {
      const newSrc = extractLinks(domain).then((links) => links.map((link) => changeLinksToLocal(link)));
      $(this).attr(attr, newSrc);
    });
  });
  return writeFile(filepath, fileName, $.html());
}

// renameLinks(url)
