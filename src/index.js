import { downloadHTML } from "../utils/downloadHTML.js";
import downloadPageResourses from "../utils/downloadPageResourses.js";

const pageLoader = (domain, filepath = './') => {
  downloadHTML(domain);
  downloadPageResourses(domain);
  };

// pageLoader('https://www.w3schools.com/')

pageLoader('https://ru.hexlet.io/courses');

export default pageLoader;