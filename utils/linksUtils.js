import axios from 'axios';
import Listr from 'listr';
import path from 'path';
import fsp from 'fs/promises';
import {
  isAbsolute,
  changeLinksToLocal,
  createFileName,
  mappingTagsAndAttrbs,
} from './smallUtils.js';

export const downloadResources = (links, filepath) => {
  const promises = links.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => response.data)
      .then((fileData) => {
        const fileName = createFileName(link);
        const filesDestination = path.join(filepath, fileName);
        return fsp.writeFile(filesDestination, fileData);
      }),
  }));

  return new Listr(promises, { recursive: true, exitOnError: false }).run().catch(() => {});
};

export const extractLinks = ($, domain) => {
  const regex = /\.js|.css|.png|.jpg/g;
  const links = [];
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    return $(tag).each(function extractLink() {
      let href = $(this).attr(attr);
      // если я не буду проверять, то извлекются и другие ненужные ссылки
      if (href && isAbsolute(href) && regex.test(href)) {
        links.push(href);
      } else if (href && !isAbsolute(href) && regex.test(href)) {
        href = `${domain}/${href}`;
        links.push(href);
      }
    });
  });
  // причем если пишу так, то файлы .js не скачиваются??
  // return links.filter((current) => regex.test(current));
  return links;
};

export const replaceLinks = ($, domain, filepath) => {
  const links = extractLinks($, domain);
  const renamedLinks = [];
  links.forEach((current) => renamedLinks.push(changeLinksToLocal(current)));
  mappingTagsAndAttrbs.map((current) => {
    const { tag, attr } = current;
    $(tag).each(function replaceLink(i) {
      const newSrc = renamedLinks[i];
      return $(this).attr(attr, newSrc);
    });
    // return $.html(); - если вот так делать, то в index.js выдает, что $.html() - это undefined ??
    return fsp.writeFile(filepath, $.html());
  });
};
