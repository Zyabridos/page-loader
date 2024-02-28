import os from 'os';
import fsp from 'fs/promises';
import path from 'path';
import pageLoader from '../src/index.js';

// test('exchange 1', async () => {
//   const firstPath = `${os.tmpdir()}/first`;
//   const secondPath = `${os.tmpdir()}/second`;
//   const firstContent = 'content1';
//   const secondContent = 'content2';
//   await fsp.writeFile(firstPath, firstContent);
//   await fsp.writeFile(secondPath, secondContent);
//   await exchange(firstPath, secondPath);

//   const result1 = await fsp.readFile(firstPath, 'utf-8');
//   expect(result1).toBe(secondContent);
//   const result2 = await fsp.readFile(secondPath, 'utf-8');
//   expect(result2).toBe(firstContent);
// });


test('page loader', async () => {
  const firstPath = `${os.tmpdir()}/firstFakeFilePath`;
  const fileContent = fsp.readFile(firstPath, 'utf-8');
  const expected = await path.resolve(process.cwd(), '__fixtures__/expected');
  const actual = pageLoader('https://ru.hexlet.io/courses', firstPath);
  expect(actual).toEqual(expected);
});
