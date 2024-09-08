/* eslint-disable */
import os from 'os';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import fsp from 'fs/promises';
import { createHtmlFileName } from '../utils/smallUtils.js';
import pageLoader from '../src/index.js';

nock.disableNetConnect();

let tempDir; let expectedCSS; let expectedPNG; let expectedJS; let response; let expected;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fsp.readFile(getFixturePath(filename), 'utf-8');
const readActual = (filename) => fsp.readFile(path.join(tempDir, 'ru-hexlet-io-courses_files', filename), 'utf-8');

const domain = 'https://ru.hexlet.io/courses';
const htmlFileName = 'ru-hexlet-io-courses.html';

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
  nock('https://ru.hexlet.io').get('/courses/assets/application.css').reply(200, expectedCSS);
  nock('https://ru.hexlet.io').get('/courses/assets/professions/nodejs.png').reply(200, expectedPNG);
  // nock('https://ru.hexlet.io').get('/courses/').reply(200, response);
  nock('https://ru.hexlet.io').get('/courses/packs/js/runtime.js').reply(200, expectedJS);
});

afterEach(async () => {
  nock.cleanAll();
});

test('html-file name is correct', async () => {
  await pageLoader(domain, tempDir);
  const actual = `${createHtmlFileName(domain)}`;
  const expected = 'ru-hexlet-io-courses.html'
  expect(actual).toEqual(expected);
});

test('html-file data is correct', async () => {
  await pageLoader(domain, tempDir);
  const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
  expect(fileData).toEqual(expected.trim());
});

test('html-attached files are downloaded correct', async () => {
  await pageLoader(domain, tempDir)
  const actualPNG = await readActual('ru-hexlet-io-assets-professions-nodejs.png')
  const actualCSS = await readActual('ru-hexlet-io-assets-application.css');
  const actualJS = await readActual('ru-hexlet-io-packs-js-runtime.js');

  expect(actualPNG).toEqual(expectedPNG);
  expect(actualCSS).toEqual(expectedCSS);
  expect(actualJS).toEqual(expectedJS);
});


  describe('file system errors', () => {
    test('should throw when dirrectory does not exists', async () => {
    const expectedErrorMessage = "ENOENT: no such file or directory, access '/notexist'";
    await expect(pageLoader(domain, '/notexist')).rejects.toThrow(expectedErrorMessage);
    }) ;
    test('should throw when access is denied', async () => {
      await fsp.chmod(tempDir, 666);
      await expect(pageLoader(domain, tempDir)).rejects.toThrow();
    });
});

const statusCodes = [404, 500]

 test.each(statusCodes)('network error: status code', async () => {
    async (statusCodes) => {
      nock('https://ru.hexlet.io').persist().get('/courses').reply(statusCodes, undefined);

      await expect(pageLoader(domain, tempDir)).rejects.toThrow();
    };
  });
