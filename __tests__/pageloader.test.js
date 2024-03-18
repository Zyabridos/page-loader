import os from 'os';
import path from 'path';
import nock from 'nock';
import * as fs from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { downloadHTML } from '../utils/downloadHTML.js';
import pageLoader from '../src/index.js';

nock.disableNetConnect();

const __dirname = dirname(fileURLToPath(import.meta.url));
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename));

const testedUrl = 'https://ru.hexlet.io/courses';

let fakepath;
let testPath;

beforeEach(async () => {
  fakepath = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
});

afterEach(async () => {
  await fs.rm(fakepath);
});

test('amount of files is correct', async () => {
  // const directoryPath = getFixturePath('nested');
  // const mock = jest.fn();
  // getFilesCount(directoryPath, mock);
  // expect(mock).toHaveBeenCalledTimes(1);
  // expect(mock).toHaveBeenCalledWith('Go!');
});

test('page is downloaded into desired directory', async () => {
  nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200);

    expect(downloadHTML(testedUrl))
  // testPath = path.join(fakepath, 'ru-hexlet-io-courses.html');
  // const result = await downloadHTML('https://ru.hexlet.io/courses', fakepath);
  // const rightString = `Page was successfully downloaded into '${testPath}'`;
  // expect(result).toEqual(rightString);
  
});

test('html-file data is correct', async () => {
    nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200);

    testPath = path.join(fakepath, 'ru-hexlet-io-courses-.html');
    const actual = await downloadHTML(testedUrl, fakepath);
    const expected = readFile('expected_hexlet_full.html').toString();
    expect(actual).toEqual(expected);
})
