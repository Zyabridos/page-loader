// @ts-check
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import fsp from 'fs/promises';
import _ from 'lodash';
import pageLoader from '../src/index.js';

nock.disableNetConnect();

let tempDir; let expectedCSS; let expectedPNG; let expectedJS; let response; let expected;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');
const readActual = (filename) => fsp.readFile(path.join(tempDir, 'ru-hexlet-io-courses_files', filename), 'utf-8');

const url = 'https://ru.hexlet.io/courses';
const htmlFileName = 'ru-hexlet-io.html';

const statusCodes = [_.range(100, 103), _.range(300, 308), _.range(400, 418), _.range(421, 429), 431, 451, _.range(500, 508), 510, 511].flat();

beforeAll(async () => {
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ru-hexlet-io-test'));
  response = await readFixture('response.html');
  expected = await readFixture('expected.html');
  expectedCSS = await readFixture('style.css');
  expectedPNG = await readFixture('nodejs.png');
  expectedJS = await readFixture('JSfile.js');
})

beforeEach(async () => {

  nock('https://ru.hexlet.io').get('/courses').reply(200, response);

  nock('https://ru.hexlet.io').get('/courses').reply(200, response);
  nock('https://ru.hexlet.io').get('/assets/menu.css').reply(200, expectedCSS);
  nock('https://ru.hexlet.io').get('/assets/professions/nodejs.png').reply(200, expectedPNG);
  nock('https://ru.hexlet.io').get('/packs/js/runtime.js').reply(200, expectedJS);
});

afterEach(async () => {
  nock.cleanAll();
});

test('html-file data is correct', async () => {
  await pageLoader(url, tempDir);
  const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
  expect(fileData).toEqual(expected);
});

test('html-attached files are downloaded correct', async () => {
  await pageLoader(url, tempDir);
  const actualPNG = await readActual('ru-hexlet-io-assets-professions-nodejs.png')
  const actualCSS = await readActual('ru-hexlet-io-assets-application.css');
  const actualJS = await readActual('ru-hexlet-io-packs-js-runtime.js');

  expect(actualPNG).toEqual(expectedPNG);
  expect(actualCSS).toEqual(expectedCSS);
  expect(actualJS).toEqual(expectedJS);
});



  // test('should throw with invalid URL', async () => {
  //   await expect(pageLoader('/nonexist', '/notexist')).rejects.toThrow();
  // })

  // test.each(statusCodes)('network error: status code', async () => {
  //   async (statusCodes, error) => {
  //     nock('https://ru.hexlet.io').persist().get('/courses').reply(statusCodes, null);

  //     await expect(pageLoader(url, tempDir)).rejects.toThrow(error);
  //   };
  // });
