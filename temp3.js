import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import {
  writeFile,
  createFileName,
  createFolderName,
  changeLinksToLocal,
} from '../utils/smallUtils.js';
import path from 'path';
import { downloadResources, extractLinks, replaceLinks } from '../utils/linksUtils.js';
import { error } from 'console';
import Listr from 'listr';

const log = debug('page-loader.js');

// const url = 'https://www.w3schools.com';
const url = 'https://ru.hexlet.io/courses';

async function pageLoader (domain, filepath = process.cwd())  {
  const htmlFileName = createFileName(domain) + '.html';
  const folderName = createFolderName(domain);
  let html;

  const filesDestination = path.join(filepath, '_files');

    // return axios
    // .get(domain),
    // fsp.mkdir(filesDestination, { recursive: true})
    // .then((response) => {

  // return axios.get(resource)
  //   .then((r) => {
  //     log(`Start loading ${resource}`);
  //     rawHtml = r.data;
  //   })
  return axios
    .get(domain),
      fsp.mkdir(filesDestination, { recursive: true})
      .then(() => {
        log(`directory for the page assets has been created at the ${filesDestination}`);
      })
      .catch(error)
    .then((response) => {
      // log(`${response}`);
      const html = response.data;
      const $ = cheerio.load(html);
      const links = extractLinks($, domain);
      const replacementLinks = [];
      links.forEach((current) => replacementLinks.push(changeLinksToLocal(current)));
      const newHTML = replaceLinks($, replacementLinks, domain);
      const listerTasks = links.map(({ task, link }) => ({
        title: `downloading the file from ${link} and saving in the ${filesDestination}`,
        task: () => task,
      }), { recursive: true, exitOnError: false});
      
        return Promise.all([
          writeFile(htmlFileName, newHTML, path.join(filepath)),
          downloadResources(links, filesDestination) 
            .then(() => writeFile(htmlFileName, newHTML, path.join(filepath)))
            .catch(error),
          new Listr(listerTasks).run().catch(() => {}),
        ]);
      })
      .then(() => path.join(filepath, htmlFileName));
};



pageLoader(url)

export default pageLoader;

// node bin/page-loader.js -o mydir https://ru.hexlet.io/courses

// node bin/page-loader.js --debug https://ru.hexlet.io/courses

  // return axios
  //   .get(domain),
  //     fsp.mkdir(filesDestination, { recursive: true})
  //     .then(() => {
  //       log(`directory for the page assets has been created at the ${filesDestination}`);
  //     })
  //     .catch(error)
  //   .then((response) => {
    