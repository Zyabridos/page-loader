import os from 'os';
import path from 'path';
import nock from 'nock';
import * as fs from 'fs';
import fsp from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { downloadHTML } from '../utils/downloadHTML.js';
import pageLoader from '../src/index.js';
import { expected, actuall } from '../__fixtures__/hexlet_html.js';

// nock.disableNetConnect();

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const testedUrl = 'https://ru.hexlet.io/courses';
const expectedFileName = 'ru.hexlet.io/courses.html';

let tempDir;
let nonExistingDirectory = '/magic directory that dissapears';

beforeEach(async () => {
    tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

afterEach(async () => {
  nock.cleanAll();
});

test('amount of files is correct', async () => {
  // const directoryPath = getFixturePath();
  // const mock = jest.fn();
  // getFilesCount(directoryPath, mock);
  // expect(mock).toHaveBeenCalledTimes(1);
  // expect(mock).toHaveBeenCalledWith('Go!');
});

test('page is downloaded into desired directory', async () => {
    nock('https://ru.hexlet.io')
    .persist()
    .get(link)
    .reply(200, data);
    
});

test('html-file data is correct', async () => {
  await pageLoader(testedUrl, tempDir);
  const actual = await fsp.readFile(path.join(tempDir, expectedFileName), { encoding: 'utf8' });
  expect(actual).toEqual(expexted);
})
