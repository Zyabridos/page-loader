import axios from "axios";
import fsp from 'fs/promises'
import { URL } from 'url';

const createFileName = (site) => {
  const fileFormat = '.html';
  const url = new URL(site);
  const hostname = url.hostname.split('.').join('-');
  const pathname = url.pathname.split('/').join('-');
  return `${hostname}${pathname}${fileFormat}`
}

const pageLoader = (site) => {
  const fileName = createFileName(site);
  const listPromise = fetch(site)
  .then((response) => {
    // get text from Response stream
    return response.text();
  })
  .then((textContent) => {
    // write html from response to index.html
    fsp.writeFile(fileName, textContent, () => {});
  });
}

export default pageLoader;