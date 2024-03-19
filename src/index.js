import { downloadHTML } from "../utils/downloadHTML.js";
import downloadPageResourses from "../utils/downloadPageResourses.js";

const url = 'https://ru.hexlet.io/';

// const url = 'https://www.w3schools.com';

const pageLoader = (domain, filepath = './') => {
  downloadHTML(domain);
  // downloadPageResourses(domain);
  };

pageLoader(url);


export default pageLoader;