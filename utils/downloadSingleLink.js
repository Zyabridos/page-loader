import fsp from 'fs/promises';
import { createFileName, createFolderName, writeFile } from './smallUtils.js';
import axios from 'axios';
import { join } from 'path';

export async function downloadFileFromFullLink(fullLink, filepath = './') {
  const fileName = createFileName(fullLink);
  const folderName = createFolderName(fullLink);
  const filesFolder = join(folderName, '_files');
  // fsp.mkdir(filesFolder, { recursive: true });
  fsp.mkdir(filepath, { recursive: true });

  const response = await axios.get(fullLink, { responseType: 'arraybuffer' });
  // writeFile(filepath, fileName, response.data);
  writeFile(fileName, response.data, filepath);
}

// downloadFileFromFullLink(
//   'https://cdn2.hexlet.io/assets/selectize/selectize-92d62aa4279838818baaaac80c4290e0c76d96eeda76bddc0ec3d99fe84d0500.css',
// );
