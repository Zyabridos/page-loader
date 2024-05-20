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

async function pageLoader (domain, filepath)  {
  const htmlFileName = createFileName(domain) + '.html';
  const folderName = createFolderName(domain);

  const filesDestination = path.join(filepath, '_files');
  // fsp.mkdir(filesDestination, { recursive: true});

  return axios
    .get(domain),
    fsp.mkdir(filesDestination, { recursive: true})
    .then((response) => {

      const html = response.data;
      const $ = cheerio.load(html);
      const links = extractLinks($, domain);
      const replacementLinks = [];
      links.forEach((current) => replacementLinks.push(changeLinksToLocal(current)));
      const listerTasks = links.map(({ task, link }) => ({
        title: `downloading the file from ${link} and saving in the ${filesDestination}`,
        task: () => task,
      }), { recursive: true, exitOnError: false});
      const newHTML = replaceLinks($, replacementLinks, domain);

      log(`Downloading an html named ${htmlFileName} into folder ${filepath}`);
      downloadResources(links, filesDestination)
      .then(() => writeFile(htmlFileName, newHTML, path.join(filepath)))
      new Listr(listerTasks).run().catch(() => {})
    })
    .catch(error)
};


// pageLoader(url, 'mydir')

export default pageLoader;

// node bin/page-loader.js -o mydir https://ru.hexlet.io/courses

// node bin/page-loader.js --debug -o mydir https://ru.hexlet.io/courses