import debug from "debug";
import { downloadHTML } from "../utils/downloadHTML.js";
import downloadPageResourses from "../utils/downloadPageResourses.js";

const log = debug('page-loader.js');

const url = 'https://ru.hexlet.io/';

// const url = 'https://www.w3schools.com';

const pageLoader = (domain, filepath = './') => {
  downloadHTML(domain);
  log('yay')
  // downloadPageResourses(domain);
  };

pageLoader(url);


export default pageLoader;