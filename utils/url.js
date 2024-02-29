import fsp from 'fs/promises';
import { join } from "path";
import { URL } from 'url';

// export async function makeDirectory(...dirname) {
//   // const projectFolder = join(dirname, 'test', 'project');
//   const projectFolder = join(dirname);
//   const dirCreation = fsp.mkdir(projectFolder, { recursive: true });

//   return dirCreation;
// }


export async function makeDirectory(dirname, dirnameForFiles) {
  // const projectFolder = join(dirname, 'test', 'project');
  const projectFolder = join(dirname, dirnameForFiles);
  const dirCreation = fsp.mkdir(projectFolder, { recursive: true });

  return dirCreation;
}


export const createFileName = (site, fileFormat) => {
  const url = new URL(site);
  const hostname = url.hostname.split('.').join('-');
  const pathname = url.pathname.split('/').join('-');
  return `${hostname}${pathname}${fileFormat}`
};
