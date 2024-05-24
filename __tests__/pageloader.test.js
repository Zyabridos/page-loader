import { fileURLToPath } from 'url';
import { tmpdir } from 'node:os';
import fsp from 'node:fs/promises';
import path from 'node:path';
import nock from 'nock';
import * as prettier from 'prettier';
import pageLoad from '../src/index.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const mockUrl = 'https://ru.hexlet.io/courses';
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');
const readResult = (filename) => {
  const fullPath = path.join(tmpdir(), 'ru-hexlet-io-courses_files', filename);
  return fsp.readFile(fullPath, 'utf-8');
};

nock.disableNetConnect();

let before;
let after;
let expectedStyle;
let expectedImage;
let expectedScript;

beforeAll(async () => {
  // before = await readFixture('before.html');
  // after = await readFixture('after.html');
  // after = await prettier.format(after, { parser: 'html' });
  // expectedStyle = await readFixture('style.css');
  expectedImage = await readFixture('cdn2-hexlet-ioassets-apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png');
  // expectedScript = await readFixture('script.js');
});

beforeEach(async () => {
  // nock('https://ru.hexlet.io').get('/courses').reply(200, before);
  // nock('https://ru.hexlet.io').get('/assets/application.css').reply(200, expectedStyle);
  nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png').reply(200, expectedImage);
  // nock('https://ru.hexlet.io').get('/courses').reply(200, before);
  // nock('https://ru.hexlet.io').get('/packs/js/runtime.js').reply(200, expectedScript);
});

// test('Main page should be downloaded', async () => {
//   await pageLoad(mockUrl, tmpdir());

//   const page = await fsp.readFile(path.join(tmpdir(), 'ru-hexlet-io-courses.html'), 'utf-8');
//   const formattedPage = await prettier.format(page, { parser: 'html' });

//   expect(formattedPage).toBe(after);
// });

test('image should be downloaded', async () => {
  await pageLoad(mockUrl, tmpdir());

  const image = await readResult('ru-hexlet-io-assets-professions-nodejs.png');

  expect(image).toEqual(expectedImage);
});
// test('assets should be downloaded', async () => {
//   await pageLoad(mockUrl, tmpdir());

//   const style = await readResult('ru-hexlet-io-assets-application.css');
//   const script = await readResult('ru-hexlet-io-packs-js-runtime.js');

//   expect(style).toEqual(expectedStyle);
//   expect(script).toEqual(expectedScript);
// });

// test('should fail when response status code is not 200', async () => {
//   await expect(pageLoad(mockUrl, 'https://ru.hexlet.io/undef')).rejects.toThrow();
// });

// test('should fail if dir does not exist', async () => {
//   await expect(pageLoad(mockUrl, '/notexist')).rejects.toThrow();
// });

// test('should fail if permission denied', async () => {
//   await expect(pageLoad(mockUrl, '/bin')).rejects.toThrow();
// });
