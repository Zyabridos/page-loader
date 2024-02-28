import axios from "axios";
import fsp from 'fs/promises'
import path from "path";
import { URL } from 'url';
import { join } from "path";

const createFileName = (site) => {
  const fileFormat = '.html';
  const url = new URL(site);
  const hostname = url.hostname.split('.').join('-');
  const pathname = url.pathname.split('/').join('-');
  return `${hostname}${pathname}${fileFormat}`
}

const exampleFilePath = path.resolve(process.cwd(), '__fixtures__/expected');

const pageLoader = (site, filepath = './') => {
  const fileName = createFileName(site);
  const listPromise = fetch(site)
  .then((response) => {
    return response.text();
  })
  .then((fileContent) => {
    fsp.writeFile(join(process.cwd(), filepath, fileName), fileContent);
    console.log(`Page was successfully downloaded into ${filepath}`)
  });
}

pageLoader('https://ru.hexlet.io/courses', '__fixtures__');

export default pageLoader;