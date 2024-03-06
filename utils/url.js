import fsp from 'fs/promises';
import { join } from "path";
import { URL } from 'url';
import axios from 'axios';

const imageURL = "https://cdn-luxplus.ams3.cdn.digitaloceanspaces.com/layout/header/luxplus-logo-2022.svg";

export async function createDirectory(domainFolder) {
  // const projectFolder = join(dirname, 'test', 'project');
  const projectFolder = join(domainFolder);
  const dirCreation = fsp.mkdir(projectFolder, { recursive: true });

  return dirCreation;
}


export const createFileName = (site, fileFormat) => {
  const url = new URL(site);
  const hostname = url.hostname.split('.').join('-');
  const pathname = url.pathname.split('/').join('-');
  return `${hostname}${pathname}${fileFormat}`
};

async function downloadImage(url, filepath, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  fsp.writeFile(join(process.cwd(), filepath, filename), response.data)
  .then(console.log('yay'))
}

// downloadImage(imageURL, './', 'cd.png');
// console.log(createFileName('https://bridgeport.edu/files/images/template/web-logo.png'));
