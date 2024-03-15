import { downloadHTML } from "../utils/downloadHTML.js";
import { downloadAllImg } from "../utils/downloadAllImg.js";

const pageLoader = (domain, filepath = './') => {
  downloadHTML(domain);
  downloadAllImg(domain);
  };

pageLoader('https://www.w3schools.com/')

export default pageLoader;