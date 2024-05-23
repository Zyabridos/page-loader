import os from 'os';
import path from 'path';
import nock from 'nock';
import fsp from 'fs/promises';
import _ from 'lodash';
import pageLoader from '../src/index.js';
import { expected, response } from '../__fixtures__/hexlet_html.js';

nock.disableNetConnect();

let tempDir;

const url = 'https://ru.hexlet.io/courses';
const htmlFileName = 'ru-hexlet-io.html';
const filesNames = [
  'cdn2-hexlet-ioassets-apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png',
  'cdn2-hexlet-ioassets-professions-program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png',
  'cdn2-hexlet-ioassets-selectize-selectize-92d62aa4279838818baaaac80c4290e0c76d96eeda76bddc0ec3d99fe84d0500.css',
];

const statusCodes = [_.range(100, 103), _.range(300, 308), _.range(400, 418), _.range(421, 429), 431, 451, _.range(500, 508), 510, 511].flat();

beforeEach(async () => {
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'ru-hexlet-io-test/'));
  nock('https://ru.hexlet.io').get('/courses').reply(200, response);
});

afterEach(async () => {
  nock.cleanAll();
});

test('html-file data is correct', async () => {
  await pageLoader(url, tempDir);
  const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
  expect(fileData).toEqual(expected);
});

test('all resourses are download', async () => {
  const actual = await pageLoader(url, tempDir);

  const htmlFileDir = await fsp.readdir(path.join(tempDir));
  const filesDir = await fsp.readdir(path.join(tempDir, '_files'));

  expect(actual).toBe(path.join(tempDir, htmlFileName));
  expect(htmlFileDir).toContain(htmlFileName);
  filesNames.forEach((currentFileName) => {
    expect(filesDir).toContain(currentFileName);
  });
});

test('the directory doesn\'t exist', async () => {
  await pageLoader(url, '/i should not exist').rejects.toThrow();
});

test('permission denied', async () => {
  await pageLoader(url, '/i should not exist').rejects.toThrow();
});

describe('naxios response status is not 2xx', () => {
  afterEach(() => nock.cleanAll());

  test.each(statusCodes)('network error: status code', () => {
    async (statusCodes, error) => {
      nock('https://ru.hexlet.io').persist().get('/courses').reply(statusCodes, null);

      await expect(pageLoader(url, tempDir)).rejects.toThrow(error);
    };
  });
});
