import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import axios from 'axios';
import debug from 'debug';
import path from 'path';
import { error } from 'console';
import Listr from 'listr';
import { downloadResources, extractLinks, replaceLinks } from '../utils/linksUtils.js';
import {
  writeFile,
  createFileName,
  createFolderName,
  changeLinksToLocal,
} from '../utils/smallUtils.js';

const log = debug('page-loader.js');

const pageLoader = (domain, filepath = process.cwd()) => {
  log(`input data is domain: ${domain}, filepath: ${domain}`);
  const htmlFileName = `${createFileName(domain)}.html`;
  let folderName = path.join(filepath, createFolderName(domain));
  if (filepath === process.cwd()) {
    folderName = createFolderName(domain);
  }

  const filesDestination = path.join(folderName, '_files');

  return Promise.all([
    axios.get(domain),
    fsp.mkdir(filesDestination, { recursive: true })
      .then(() => {
        log(`directory for the html files is ${filesDestination}`);
      })
      .catch(error),
  ])
    .then(([response]) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const links = extractLinks($, domain);
      const replacementLinks = [];
      links.forEach((current) => replacementLinks.push(changeLinksToLocal(current)));
      const newHTML = replaceLinks($, replacementLinks, domain);

      const listerTasks = links.map((link) => ({

        title: `downloading the file from ${link} and saving into ${path.join(filepath, filesDestination)}`,
        task: () => axios.get(link, { responseType: 'arraybuffer' })
          // .then((response) => response.data),
          .then(() => response.data),
      }), { recursive: true, exitOnError: false });

      return Promise.all([
        downloadResources(links, filesDestination)
          .then(() => writeFile(htmlFileName, newHTML, path.join(folderName))),
        new Listr(listerTasks).run().catch(() => { console.error(error.message); }),
      ]);
    })
    .then(() => path.join(filepath, htmlFileName));
};

export default pageLoader;

// pageLoader(url, 'mydir');

// asciinema rec
// node ../bin/page-loader.js -h
// tree
// node ../bin/page-loader.js --option --debug new\ directory https://ru.hexlet.io/courses
// tree
// exit

// node ../bin/page-loader.js --option --debug new\ directory https://ru.hexlet.io/courses

// node ../bin/page-loader.js --debug https://ru.hexlet.io/courses
