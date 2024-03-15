import fsp from 'fs/promises';
import request from 'request';
import * as cheerio from 'cheerio';
import { join } from 'path';
import { createFileName, createFolderName } from './utils/smallUtils.js';

const url = 'https://www.w3schools.com/';

// здесь я уже как-то разобралась с cheerio, но axios и cheerio вместе вообще не сходятся

export const changeAttr = (domain) => {

request(url, (err, resp, html)=>{

    if(!err && resp.statusCode == 200){

        const fileNameHTML = createFileName(domain, '.html');
  const domainFolder = createFolderName(domain);


        console.log("Request of image downloading was success ");

        const $ = cheerio.load(html);

        console.log(`${domainFolder}${fileNameHTML}`)
        $('img').attr('src', 'https://example.com/image.jpg');
        const modifiedHtml = $.html();
        fsp.writeFile(join(process.cwd(), domainFolder, fileNameHTML), modifiedHtml);
        

    } else { console.log("Requeston of image downloading has failed "); }
})
};

changeAttr((url))
