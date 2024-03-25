import fsp from 'fs/promises';
import * as cheerio from 'cheerio';
import { createFileName, createFolderName } from './smallUtils.js';
import axios from 'axios';
import { join } from "path";
import { URL } from 'url';

const url = 'https://www.w3schools.com';

// Function to extract all links from a webpage using Cheerio
const extractLinks = async (url) => {
  try {
    // Fetch the content of the webpage
    const response = await axios.get(url);
    const data = response.data;

    // Load the webpage content into Cheerio
    const $ = cheerio.load(data);

    // Initialize an array to store the links
    const links = [];

    // Select all anchor tags and extract href attributes
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      // Make sure the href attribute exists and is not empty
      if (link && link.trim() !== '') {
        links.push(link);
      }
    });

    // Return the array of links
    return links;
  } catch (error) {
    console.error('Error fetching or parsing the webpage:', error);
    return [];
  }
};

// Example usage

extractLinks(url).then((links) => {
  console.log('Extracted links:', links);
});