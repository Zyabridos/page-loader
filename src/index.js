import { downloadImage } from "../utils/saveImage.js";
import { downloadHTML } from "../utils/downloadHTML.js";

const pageLoader = (domain, filepath = './') => {
  downloadImage(domain);
  downloadHTML(domain);
  };

pageLoader('https://www.bridgeport.edu/');

export default pageLoader;