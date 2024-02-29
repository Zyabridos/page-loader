import axios from "axios";
import fsp from 'fs/promises'
import path from "path";
import { join } from "path";
import { createFileName, makeDirectory} from "../utils/url.js";

const exampleFilePath = path.resolve(process.cwd(), '__fixtures__/expected');

const pageLoader = (site, filepath = './') => {
  const fileNameHTML = createFileName(site, '.html');
  const fileNameImage = createFileName(site, '.png');
  const initialFolder = createFileName(site, '');
  const filesFolder = createFileName(site, '_files');
  makeDirectory(initialFolder, filesFolder);
  const listPromise = fetch(site)
  .then((response) => {
    return response.text();
  })
  .then((fileContent) => {
    fsp.writeFile(join(process.cwd(), filepath, fileNameHTML), fileContent);
    //вот здесь нужно будет создать полный путь типа '/app/page-loader/page-loader-hexlet-repl.co.html'
    console.log(`Page was successfully downloaded into ${initialFolder}`)
  });
}

pageLoader('https://ru.hexlet.io/courses', '__fixtures__');

export default pageLoader;