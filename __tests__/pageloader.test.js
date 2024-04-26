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

let tempDir;
const url = 'https://ru.hexlet.io/courses';
const htmlFileName = 'ru-hexlet-io.html';

beforeEach(async () => {
  tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  // nock('https://ru.hexlet.io').get('/courses').reply(200, response);
});

afterEach(async () => {
  nock.cleanAll();
});

describe('area is calculated when', function() {
  test('html is correct', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(200, response);

    await pageLoader(url, tempDir);
    const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });
    expect(fileData.toEqual(expected));
  });

  test('html is downloaded', async () => {
    nock('https://ru.hexlet.io').get('/courses').reply(200, response);

    const actual = await pageLoader(url, tempDir);
    const fileData = await fsp.readFile(path.join(tempDir, htmlFileName), { encoding: 'utf8' });

    expect(actual).toBe(path.join(tempDir, htmlFileName));
    expect(fileData).toEqual(expectedData);
    expect(files).toContain(htmlFileName);
});
});
