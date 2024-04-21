import { downloadFileFromFullLink } from './downloadSingleLink.js';
import { extractLinks } from './extractLinks.js';

const url = 'https://ru.hexlet.io/courses';

export const downloadAllLinks = (domain, filepath) => {
  extractLinks(domain).then((links) => {
    links.map((currentLink) => {
      downloadFileFromFullLink(currentLink, filepath);
    });
  });
};
