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
const readFile = (filename) => fsp.readFileSync(getFixturePath(filename));

const url = 'https://ru.hexlet.io/courses';
const htmlFileName = 'ru-hexlet-io.html';
const fileDirectoryName = 'ru-hexlet-io-courses/_files';
const expectedData = expected;
const fileNames = [
  'cdn2-hexlet-ioassets-apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png',
  'cdn2-hexlet-ioassets-professions-program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png',
  'cdn2-hexlet-ioassets-selectize-selectize-92d62aa4279838818baaaac80c4290e0c76d96eeda76bddc0ec3d99fe84d0500.css',
];

//
// const url = 'https://ru.hexlet.io/courses';
// const expectedData = '<!DOCTYPE html><html><head></head><body></body></html>';
// const filename = 'ru-hexlet-io-courses.html';
// const directoryName = 'ru-hexlet-io-courses_files';
// const imageNames = [
//   'ru-hexlet-io-assets-professions-nodejs.png',
//   'ru-hexlet-io-assets-professions-nodejs2.png',
// ];
//
let files;
let tempDir;
let nonExistingDirectory = '/magic directory that dissapears';

beforeEach(async () => {
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader'));
  const image1 = await fsp.readFile(getFixturePath('cdn2-hexlet-ioassets-professions-program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png'), null);
  const image2 = await fsp.readFile(getFixturePath('cdn2-hexlet-ioassets-apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png'), null);
  const css = await fsp.readFile(getFixturePath('cdn2-hexlet-ioassets-selectize-selectize-92d62aa4279838818baaaac80c4290e0c76d96eeda76bddc0ec3d99fe84d0500.css',), null);
  files = [image1, image2,  css];
  nock('https://ru.hexlet.io').get('/courses').reply(200, response);
  nock('https://cdn2.hexlet.io/').get('/assets/professions/program-f26fba51e364abcd7f15475edb68d93958426d54c75468dc5bc65e493a586226.png').reply(200, image1);
  nock('https://cdn2.hexlet.io/').get('/assets/apple-touch-icon_ru-5ac2554d7f3856089a0babcf2dce22a07b53796e0646fb9bfc1f3e360fad7458.png').reply(200, image1);
  nock('https://cdn2.hexlet.io/').get('/assets/selectize/selectize-92d62aa4279838818baaaac80c4290e0c76d96eeda76bddc0ec3d99fe84d0500.css').reply(200, css);
});

afterEach(async () => {
  nock.cleanAll();
});

test('html is downloaded', async () => {
  nock('https://ru.hexlet.io').get('/courses').reply(200, expectedData);

  const result = await pageLoader(url, tempDir);
  const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
  const files = await fsp.readdir(tempDir);

  expect(result).toBe(path.join(tempDir, htmlFileName));
  expect(fileData).toEqual(expectedData);
  expect(files).toContain(htmlFileName);
});

test('html is correct', async () => {
  await pageLoader(url, tempDir);
  const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
  expect(fileData).toEqual(expected);
});

test('file download', async () => {
  await pageLoader(url, tempDir);
  const directory = path.join(tempDir, fileDirectoryName);
  const files = await fsp.readdir(directory);

  fileNames.forEach(async (name, i) => {
    expect(files).toContain(name);
    const tempFile = await fsp.readFile(path.join(directory, name), null);
    expect(tempFile).toEqual(file[i]);
  });
});



// beforeEach(async () => {
//     tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
// });

// afterEach(async () => {
//   nock.cleanAll();
// });

// test('amount of files is correct', async () => {
//   // const directoryPath = getFixturePath();
//   // const mock = jest.fn();
//   // getFilesCount(directoryPath, mock);
//   // expect(mock).toHaveBeenCalledTimes(1);
//   // expect(mock).toHaveBeenCalledWith('Go!');
// });

// test('page is downloaded into desired directory', async () => {
//     nock('https://ru.hexlet.io')
//     .persist()
//     .get(link)
//     .reply(200, data);
    
// });

// test('html-file data is correct', async () => {
//   await pageLoader(testedUrl, tempDir);
//   const actual = await fsp.readFile(path.join(tempDir, expectedFileName), { encoding: 'utf8' });
//   expect(actual).toEqual(expexted);
// })
