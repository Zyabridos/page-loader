import fsp from 'fs/promises';
import { createDirectory, createFileName } from './url.js';
import axios from 'axios';
import { join } from "path";


//сохраняет только один файл - надо ее рекурсивно зафигачить
export async function downloadImage(domain) {
  const fileNamePNG = createFileName(domain, '.png');
  const domainFolderName = createFileName(domain, '');
  
  createDirectory(`./${domainFolderName}/_files`);

  const response = await axios.get(domain, { responseType: 'arraybuffer' });

  fsp.writeFile(join(process.cwd(), `./${domainFolderName}/_files`, fileNamePNG), response.data);
}

// downloadImage('https://bridgeport.edu/files/images/template/web-logo.png');
