import path from 'path';
import { extractAndReplaceLinks, downloadResources } from './utils/linksUtils.js';

const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Курсы по программированию Хекслет</title>
    <link rel="stylesheet" media="all" href="https://cdn2.hexlet.io/assets/menu.css">
    <link rel="stylesheet" media="all" href="/assets/application.css" />
    <link href="/courses" rel="canonical">
  </head>
  <body>
    <img src="/assets/professions/nodejs.png" alt="Иконка профессии Node.js-программист" />
    <h3>
      
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="/packs/js/runtime.js"></script>
  </body>
</html>`;

console.log(extractAndReplaceLinks(html, 'https://ru-hexlet-io-courses'));
// // extractAndReplaceLinks(html, 'https://ru-hexlet-io-courses');
// const [cheerioHtml, links] = extractAndReplaceLinks(html, 'https://ru-hexlet-io-courses');
// downloadResources(links, 'https://ru-hexlet-io-courses', path.join(process.cwd(), 'ru-hexlet-io-courses_files'));

const temp = '/Users/nina/Documents/Reprositories/Hexlet Projects/page-loader/__fixtures__/ru-hexlet-io-courses_files';
const temp2 = '/Users/nina/Documents/Reprositories/Hexlet Projects/page-loader/__fixtures__/ru-hexlet-io-courses_files';
console.log(temp === temp2);
