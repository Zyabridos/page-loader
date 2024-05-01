import os from 'os';
import path, { dirname } from 'path';
import nock from 'nock';
import fsp from 'fs/promises';
import { fileURLToPath } from 'url';
import pageLoader from '../src/index.js';
import { expected, response } from '../__fixtures__/hexlet_html.js';

nock.disableNetConnect();

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let tempDir;

const url = 'https://ru.hexlet.io/courses';
const htmlFileName = 'ru-hexlet-io.html';
const folderName = 'ru-hexlet-io';
const filesNames = [
  'cdn2-hexlet-ioassets-apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png',
  'cdn2-hexlet-ioassets-professions-program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png',
  'cdn2-hexlet-ioassets-selectize-selectize-92d62aa4279838818baaaac80c4290e0c76d96eeda76bddc0ec3d99fe84d0500.css'
]

beforeEach(async () => {
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  // nock('https://ru.hexlet.io').get('/courses').reply(200, response);
});

afterEach(async () => {
  nock.cleanAll();
});

test('html-file data is correct', async () => {
  await pageLoader(url, tempDir);
  const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
  expect(fileData).toEqual(expected);
})

test('all resourses are download', async () => {
  const actual = await pageLoader(url, tempDir);

  const htmlFileDir = await fsp.readdir(path.join(tempDir));
  const files = await fsp.readdir(path.join(tempDir, '_files'));

  expect(actual).toBe(path.join(tempDir, htmlFileName));
  expect(htmlFileDir).toContain(htmlFileName);
  filesNames.forEach((currentFileName) => {
    expect(files).toContain(currentFileName);
  })
});
