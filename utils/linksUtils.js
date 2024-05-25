import axios from 'axios';
import {
  isAbsolute,
  changeLinksToLocal,
  createFileName,
  writeFile,
  mappingTagsAndAttrbs,
  removeDoubleDash,
} from './smallUtils.js';

export const downloadResources = (links, dirname) => {
  const promises = links.map((link, i) => axios.get(link, { responseType: 'arraybuffer' })
    .then((response) => {
      const fileName = createFileName(links[i]);
      writeFile(fileName, response.data, dirname);
    }));
  return Promise.all(promises);
};

export const extractLinks = ($, domain) => {
  const regex = /\.js|.css|.png|.jpg/g;
  const links = [];
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function extractLink() {
      let href = $(this).attr(attr);
      if (href && isAbsolute(href) && regex.test(href)) {
        links.push(href);
      } else if (href && !isAbsolute(href) && regex.test(href)) {
        href = `${domain}/${href}`;
        links.push(href);
      }
    });
    return current;
  });
  return links.map((current) => removeDoubleDash(current));
};

export const replaceLinks = ($, replacementLinks, domain) => {
  const links = extractLinks($, domain);
  const renamedLinks = [];
  links.forEach((current) => renamedLinks.push(changeLinksToLocal(current)));
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function replaceLink(i) {
      const newSrc = replacementLinks[i];
      return $(this).attr(attr, newSrc);
    });
    return current;
  });
  return $.html();
};
