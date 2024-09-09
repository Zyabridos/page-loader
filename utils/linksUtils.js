import axios from 'axios';
import Listr from 'listr';
import path from 'node:path';
import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import uniq from 'lodash/uniq.js';
import {
  createAssetName,
  mappingTagsAndAttrbs,
  isSameDomain,
  createFolderName,
} from './smallUtils.js';

export const downloadLocalResources = (links, domain, filepath) => {
  const promises = links.map((link) => ({
    title: `downloading the file from ${link} and saving into ${filepath}`,
    task: () => axios.get(link, { responseType: 'arraybuffer' })
      .then((response) => {
        const fileName = createAssetName(link, domain);
        const filesDestination = path.join(filepath, fileName);
        return fsp.writeFile(filesDestination, response.data);
      })
      .catch((error) => {
        console.error(`An error has occured: ${createAssetName(link, domain)} was not saved, ${error}`);
        throw new Error(error.message);
      }),
  }));

  return new Listr(promises, { recursive: true, exitOnError: false }).run().catch(() => {});
};

export const extractAndReplaceLinks = (html, domain) => {
  const $ = cheerio.load(html);
  const links = [];
  const entries = Object.entries(mappingTagsAndAttrbs);
  const fileNames = [];

  entries.forEach(([tag, attr]) => {
    $(tag).each((_, element) => {
      const href = $(element).attr(attr);
      if (isSameDomain(href, domain) && href !== undefined) {
        const url = new URL(href, domain);
        links.push(url.href);
        fileNames.push(createAssetName(url.href));
        $(element).attr(attr, (`${createFolderName(domain)}_files/${createAssetName(url.href)}`));
      }
    });
  });
  return { links: uniq(links), fileNames: uniq(fileNames), newHtml: $.html() };
};

const testHtml2 = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Курсы по программированию Хекслет</title>
    <link rel="stylesheet" media="all" href="https://cdn2.hexlet.io/assets/menu.css">
    <link rel="stylesheet" media="all" href="/courses/assets/application.css" />
    <link href="/courses" rel="canonical">
  </head>
  <body>
    <img src="/courses/assets/professions/nodejs.png" alt="Иконка профессии Node.js-программист" />
    <h3>
      <a href="/courses/professions/nodejs">Node.js-программист</a>
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="/courses/packs/js/runtime.js"></script>
  </body>
</html>`;
const testDomain2 = 'https://ru.hexlet.io/courses';
const testDomain = 'https://site.com/blog/about';
const testHtml = `
<!DOCTYPE html>
<html lang="ru">
  <head>
    <link rel="stylesheet" media="all" href="https://cdn2.hexlet.io/assets/menu.css">
    <link rel="stylesheet" media="all" href="/blog/about/assets/styles.css" />
    <link href="/blog/about" rel="canonical">
  </head>
  <body>
    <img src="/photos/me.jpg" alt="Иконка Me" />
    <script src="https://js.stripe.com/v3/"></script>
    <script src="/assets/scripts.js"></script>
  </body>
</html>`;
// extractAndReplaceLinks(testHtml, testDomain);
// extractAndReplaceLinks(testHtml2, testDomain2);

// console.log(getLinksAndReplaceToLocale(testHtml, testDomain));
// console.log(getLinksAndReplaceToLocale(testHtml2, testDomain2));

// getLinksAndReplaceToLocale(testHtml, testDomain);
// getLinksAndReplaceToLocale(testHtml2, testDomain2);

// { filepath: '/var/tmp/ru-hexlet-io-courses.html' } - объект с путём до загруженного файла
// а сейчас возвращается строка с именем директории

// node bin/page-loader.js --debug https://ru.hexlet.io/courses

// make page-loader https://ru.hexlet.io/courses

// 1) Нужно вызов утилиты привести к виду:
// page-loader -o filepath urlPath
// Как избавиться от make? В первом проекте оставляли этот make
// 2) Сейчас вспомнила, что уже была такая проблема, но предыдущий наставник сказал, что можно оставить и node bin/page-loader.js -o filepath urlPath. Как избавиться от ошибки:
// > missing required argument 'url'
// > nina@Ninas-MacBook-Pro page-loader % make page-loader https://ru.hexlet.io/courses
// > node bin/page-loader.js
// > error: missing required argument 'url'
// > make: *** [page-loader] Error 1

// Во втором проекте была такая же проблема с missing required argument 'filepath1' и 'filepath2', я в итоге так и оставила, что утилита работает только через node bin/...
// 2) А почему функция должна возвращать объект
// `// { filepath: '/var/tmp/ru-hexlet-io-courses.html' } - объект с путём` до загруженного файла
// а не строку
// > '/var/tmp/ru-hexlet-io-courses.html'?
